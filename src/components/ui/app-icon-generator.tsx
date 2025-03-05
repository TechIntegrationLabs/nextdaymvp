import { useState, useEffect, useCallback, useRef } from 'react';

interface AppIconGeneratorProps {
  ideaTitle: string;
  ideaDescription: string;
  setGeneratedImageUrl?: (url: string) => void;
}

export function AppIconGenerator({ ideaTitle, ideaDescription, setGeneratedImageUrl }: AppIconGeneratorProps) {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isGeneratingRef = useRef(false);

  // Fallback method to generate a simple image if the API call fails
  const generateFallbackImage = useCallback(() => {
    // Use a placeholder image service with the app name encoded
    const encodedTitle = encodeURIComponent(ideaTitle || 'App');
    const placeholderUrl = `https://via.placeholder.com/1024x1024.png?text=${encodedTitle}`;
    setIconUrl(placeholderUrl);
    
    if (setGeneratedImageUrl) {
      setGeneratedImageUrl(placeholderUrl);
    }
    
    setError('Using placeholder image due to API limitations. You can try again later.');
  }, [ideaTitle, setGeneratedImageUrl]);

  // Generate an image using OpenAI's API based on the idea description
  const generateAppImage = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isGeneratingRef.current) return;
    
    isGeneratingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a prompt for the image generation using the specific format requested
      const prompt = `create an image for this app: '${ideaTitle}'`;
      
      // Call OpenAI's API to generate an image
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1,
          size: "1024x1024"
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle rate limit errors specifically
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || '60';
          const retrySeconds = parseInt(retryAfter, 10);
          
          throw new Error(`Rate limit exceeded. Try again in ${retrySeconds} seconds.`);
        }
        
        throw new Error(errorData.error?.message || 'Failed to generate image');
      }
      
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        const imageUrl = data.data[0].url;
        setIconUrl(imageUrl);
        // Store the generated image URL in the context if the setter function is provided
        if (setGeneratedImageUrl) {
          setGeneratedImageUrl(imageUrl);
        }
        // Reset retry count on success
        setRetryCount(0);
      } else {
        throw new Error('No image data returned');
      }
    } catch (err) {
      console.error('Image generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
      
      // If this was a rate limit error, try to use the fallback image
      if (err instanceof Error && err.message.includes('Rate limit exceeded')) {
        generateFallbackImage();
      } else if (retryCount < 2) {
        // Retry up to 2 times for other errors, with increasing delay
        const retryDelay = (retryCount + 1) * 2000; // 2s, then 4s
        setError(`Error generating image. Retrying in ${retryDelay/1000} seconds...`);
        
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        
        timerRef.current = setTimeout(() => {
          setRetryCount(prevCount => prevCount + 1);
          isGeneratingRef.current = false;
          generateAppImage();
        }, retryDelay);
        
        return;
      } else {
        // If we've retried enough times, use the fallback image
        generateFallbackImage();
      }
    } finally {
      setIsLoading(false);
      isGeneratingRef.current = false;
    }
  }, [ideaTitle, setGeneratedImageUrl, retryCount]);

  // Cleanup any pending timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Debounced effect to generate the image
  useEffect(() => {
    if (ideaTitle && ideaDescription) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Set a new timer to delay the API call
      timerRef.current = setTimeout(() => {
        if (!iconUrl && !isGeneratingRef.current) {
          generateAppImage();
        }
      }, 1000); // 1 second debounce
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [ideaTitle, ideaDescription, generateAppImage, iconUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full bg-gray-800 rounded-lg flex items-center justify-center" style={{ height: 'min(30rem, 50vh)' }}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-custom-blue mb-4"></div>
            <p className="text-slate-200">Generating your app icon...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !iconUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full bg-gray-800 rounded-lg flex items-center justify-center p-4" style={{ height: 'min(30rem, 50vh)' }}>
          <div className="text-center">
            <p className="text-red-400 mb-4 text-sm sm:text-base">{error}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  setRetryCount(0);
                  isGeneratingRef.current = false;
                  generateAppImage();
                }}
                className="px-3 py-2 text-sm bg-custom-blue text-white rounded hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={generateFallbackImage}
                className="px-3 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Use Placeholder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (iconUrl) {
    return (
      <div className="relative h-full">
        <img
          src={iconUrl}
          alt="Generated app icon"
          className="w-full h-auto object-contain rounded-lg shadow-lg"
          style={{ maxHeight: 'min(30rem, 50vh)' }}
        />
        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 p-2 text-center">
            <p className="text-yellow-400 text-xs sm:text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full bg-gray-800 rounded-lg flex items-center justify-center" style={{ height: 'min(30rem, 50vh)' }}>
        <div className="text-center">
          <p className="text-slate-200 text-sm sm:text-base">Ready to generate app icon...</p>
        </div>
      </div>
    </div>
  );
}
