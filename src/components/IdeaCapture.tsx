import { useState, useEffect, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Mic, StopCircle, RefreshCw, Download, Copy, Edit2, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { ProgressBar } from './ui/progress-bar';
import { TypingAnimation } from './ui/typing-animation';
import ReactMarkdown from 'react-markdown';
import { AppIconGenerator } from './ui/app-icon-generator';

interface IdeaCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  setMessage: (message: string) => void;
}

export function IdeaCapture({ isOpen, onClose, setMessage }: IdeaCaptureProps) {
  const [transcription, setTranscription] = useState('');
  const [processedIdea, setProcessedIdea] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ideaTitle, setIdeaTitle] = useState('');

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl
  } = useReactMediaRecorder({ audio: true });

  const resetAll = () => {
    setTranscription('');
    setProcessedIdea('');
    setShowResults(false);
    setIsEditing(false);
    clearBlobUrl();
    setProgress(0);
    setIdeaTitle('');
  };

  const handleStartRecording = () => {
    setTranscription('');
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('model', 'whisper-1');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setTranscription(data.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setTranscription('Error transcribing audio. Please try again.');
    }
  }, []);

  const processIdea = async () => {
    setIsProcessing(true);
    setProgress(0);
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          return newProgress < 95 ? newProgress : prev;
        });
      }, 100);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: `You are a professional tech advisor and visionary at Next Day MVP, an AI-powered app development agency. Your task is to analyze a client's app idea and provide constructive, encouraging feedback that gets them excited about their project's potential.

Format your response with markdown for excellent readability:

# Idea Analysis: [TITLE OF THE APP/IDEA]

## 🌟 First Impressions
Start with genuinely honest feedback about the idea. Be encouraging but authentic - if it's innovative, say so! If it has challenges, acknowledge them but frame them as opportunities to differentiate. Be specific about what makes this idea interesting or valuable.

## 🎯 Target Audience & Market Potential
* Identify primary and secondary user groups
* Briefly analyze market size/opportunity
* Highlight any competitive advantage or unique positioning

## 💡 Core Concept & Value Proposition
* Clearly articulate what makes this idea compelling
* Explain the main problem it solves or value it creates
* Present this in an exciting way that validates their vision

## 🔑 Key Features
* List the most important features (5-7 max)
* For each feature, provide a brief description of its purpose/benefit
* Organize in order of priority/importance

## 🚀 AI Enhancement Opportunities
* Suggest 2-3 specific ways AI could enhance the app
* Be specific about what type of AI (generative, predictive, etc.) and exactly how it would improve the user experience
* Explain how these AI additions could create a competitive advantage

## 💰 Monetization Potential
* Suggest 2-3 practical, achievable monetization strategies
* Focus on models that would work well for this specific type of app
* Briefly explain why these approaches align with the user base

## 🔮 Future Possibilities
* Suggest one or two innovative features/directions they might not have considered
* Highlight how these additions could expand their market or create new opportunities

Your output should be positive, insightful, and focused on possibilities. Make the client feel their idea has potential while providing genuine value through your analysis. Use emoji icons to make the document visually appealing and easy to scan.`
          }, {
            role: "user",
            content: transcription
          }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      setProcessedIdea(content);
      
      // Extract the title from the markdown response
      const titleMatch = content.match(/# Idea Analysis: \[(.*?)\]/);
      if (titleMatch && titleMatch[1]) {
        setIdeaTitle(titleMatch[1]);
      } else {
        // Fallback - try to extract from first few words of transcription
        const words = transcription.split(' ').slice(0, 3).join(' ');
        setIdeaTitle(words || 'Your App');
      }
      
      setShowResults(true);
      setProgress(100);
      clearInterval(progressInterval);
    } catch (error) {
      console.error('Error processing idea:', error);
      setProcessedIdea('Error processing your idea. Please try again.');
      clearInterval(progressInterval);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(processedIdea);
  };

  const handleDownload = () => {
    const blob = new Blob([processedIdea], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-outline.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (mediaBlobUrl) {
      fetch(mediaBlobUrl)
        .then(response => response.blob())
        .then(blob => transcribeAudio(blob));
    }
  }, [mediaBlobUrl, transcribeAudio]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-semibold leading-6 text-white text-center mb-4"
                >
                  Tell Us About Your Idea
                </Dialog.Title>
                <div className="mb-6">
                  <p className="text-slate-300 text-center mb-4">
                    Use your microphone to describe your app idea. Here's what to include:
                  </p>
                  <ul className="text-slate-300 space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-custom-blue mt-1">•</span>
                      What problem does your app solve?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-custom-blue mt-1">•</span>
                      Who is your target audience?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-custom-blue mt-1">•</span>
                      What are the main features you want?
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-custom-blue mt-1">•</span>
                      Any specific design preferences?
                    </li>
                  </ul>
                  <p className="text-sm text-custom-blue italic">
                    Pro Tip: Don't worry about technical details—that's our job! Just focus on what you want your app to do.
                  </p>
                </div>

                {!showResults ? (
                  <>
                    <textarea
                      value={transcription}
                      onChange={(e) => setTranscription(e.target.value)}
                      className="w-full h-48 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-custom-blue focus:border-transparent transition-colors"
                      placeholder="Your transcribed text will appear here..."
                    />

                    <div className="flex gap-4">
                      <button
                        onClick={status === 'recording' ? handleStopRecording : handleStartRecording}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                          status === 'recording'
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-custom-blue hover:bg-custom-blue/90 text-white"
                        )}
                      >
                        {status === 'recording' ? (
                          <>
                            <StopCircle className="w-5 h-5" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="w-5 h-5" />
                            Start Recording
                          </>
                        )}
                      </button>

                      <button
                        onClick={resetAll}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Restart
                      </button>

                      <button
                        onClick={processIdea}
                        disabled={!transcription || isProcessing}
                        className={cn(
                          "flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ml-auto",
                          (!transcription || isProcessing)
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        )}
                      >
                        {isProcessing ? (
                          <>
                            <div className="h-4 w-4 rounded-full border-2 border-gray-400 border-t-white animate-spin"></div>
                            Processing...
                          </>
                        ) : 'Process'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex-1">
                        {isEditing ? (
                          <textarea
                            value={processedIdea}
                            onChange={(e) => setProcessedIdea(e.target.value)}
                            className="w-full h-96 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-custom-blue focus:border-transparent transition-colors"
                          />
                        ) : (
                          <div className="w-full h-[30rem] px-4 py-4 rounded-lg border border-gray-700 bg-gray-800 text-white overflow-y-auto">
                            <div className="prose prose-invert prose-headings:text-custom-blue prose-strong:text-white prose-a:text-custom-blue prose-ul:mb-4 prose-li:mb-1 max-w-none">
                              <ReactMarkdown children={processedIdea} />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {!isEditing && (
                        <div className="w-40 sticky top-0">
                          <AppIconGenerator 
                            ideaTitle={ideaTitle} 
                            ideaDescription={transcription} 
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 flex-wrap">
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-custom-blue hover:bg-custom-blue/90 text-white font-medium transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                        {isEditing ? 'Save' : 'Edit'}
                      </button>

                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
                      >
                        <Copy className="w-5 h-5" />
                        Copy
                      </button>

                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </button>

                      <button
                        onClick={() => {
                          setMessage(processedIdea);
                          onClose();
                          const contactSection = document.getElementById('contact');
                          if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Send to Contact Form
                      </button>

                      <button
                        onClick={resetAll}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all ml-auto"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Start Over
                      </button>
                    </div>
                  </div>
                )}
                {isProcessing && (
                  <div className="mt-4 space-y-3 bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-300">Processing your idea...</span>
                      <span className="text-sm text-slate-400">{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} />
                    <div className="text-sm text-custom-blue mt-2">
                      <TypingAnimation
                        messages={[
                          "Analyzing your requirements...",
                          "Identifying key features...",
                          "Estimating development scope...",
                          "Determining appropriate technology stack...",
                          "Evaluating market potential...",
                          "Calculating cost estimates...",
                          "Preparing project outline...",
                          "Almost there! Finalizing the results..."
                        ]}
                        typingSpeed={40}
                        erasingSpeed={20}
                        delayBetweenMessages={2000}
                      />
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
