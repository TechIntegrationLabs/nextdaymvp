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

  // Extract a concise description from the markdown text
  const extractConciseDescription = useCallback((markdownText: string): string => {
    try {
      // Try to extract the core concept section first (most relevant)
      const coreConcept = markdownText.match(/## 💡 Core Concept[^\n]*\n([\s\S]*?)(?=##|$)/i);
      if (coreConcept && coreConcept[1]) {
        // Get first 100 characters without markdown symbols
        return coreConcept[1].replace(/\*/g, '').replace(/#/g, '').trim().substring(0, 100);
      }
      
      // If no core concept, extract first key features
      const keyFeatures = markdownText.match(/## 🔑 Key Features[^\n]*\n([\s\S]*?)(?=##|$)/i);
      if (keyFeatures && keyFeatures[1]) {
        return keyFeatures[1].replace(/\*/g, '').replace(/#/g, '').trim().substring(0, 100);
      }
      
      // If nothing specific found, just use the first 100 non-header characters
      const cleanText = markdownText
        .replace(/^#.*$/gm, '') // Remove headers
        .replace(/\*\*.*?\*\*/g, '') // Remove bold
        .replace(/\*.*?\*/g, '') // Remove italic
        .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
        .replace(/`.*?`/g, '') // Remove code
        .trim();
      
      const firstParagraph = cleanText.split('\n\n')[0];
      return firstParagraph.substring(0, 100);
    } catch (e) {
      console.error('Error extracting description:', e);
      return '';
    }
  }, []);

  // Generate an image using Stability AI's API based on the idea description
  const generateAppImage = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isGeneratingRef.current) return;
    
    isGeneratingRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      // Ensure we have a valid title
      const safeTitle = ideaTitle?.trim() || 'App';
      
      // Extract a concise description if we have one
      let conciseDescription = '';
      if (ideaDescription && ideaDescription.trim()) {
        conciseDescription = extractConciseDescription(ideaDescription);
      }
      
      // Create a prompt for the image generation using the specific format requested
      let prompt = `Create a modern, minimalist app icon for an application called: '${safeTitle}'.`;
      prompt += ` The icon should be simple, memorable, and represent the core concept of the app.`;
      
      // Only add description if it exists and is not too long
      if (conciseDescription) {
        prompt += ` The app is about: ${conciseDescription}.`;
      }
      
      // Ensure prompt isn't too long (Stability AI has a 2000 character limit)
      if (prompt.length > 1900) {
        prompt = prompt.substring(0, 1900);
      }
      
      console.log('Generating image with prompt:', prompt);
      
      // Call Stability AI's API to generate an image
      const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_STABILITY_API_KEY}`
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
          style_preset: "digital-art"
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
        
        throw new Error(errorData.message || 'Failed to generate image');
      }
      
      const data = await response.json();
      if (data.artifacts && data.artifacts.length > 0) {
        // Stability AI returns base64 encoded images
        const base64Image = data.artifacts[0].base64;
        const imageUrl = `data:image/png;base64,${base64Image}`;
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
  }, [ideaTitle, ideaDescription, setGeneratedImageUrl, retryCount, generateFallbackImage, extractConciseDescription]);
  
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
    if (ideaTitle) {
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

  return (
    <div className="w-full bg-gray-800 rounded-lg overflow-hidden" style={{ height: 'min(30rem, 50vh)' }}>
      {iconUrl ? (
        <img 
          src={iconUrl} 
          alt={`${ideaTitle || 'App'} Icon`} 
          className="w-full h-full object-contain p-4"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-400">App icon will appear here</p>
        </div>
      )}
    </div>
  );
}
