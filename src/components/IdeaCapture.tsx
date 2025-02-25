import { useState, useEffect, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Mic, StopCircle, RefreshCw, Download, Copy, Edit2, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

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
    try {
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
            content: `You are a professional project manager and business analyst at Next Day MVP, an AI-powered app development agency. Your task is to take a client's raw idea description and organize it into a clear, structured outline.

Key points to include in your analysis:
1. Brief overview of the core concept and its unique value proposition
2. Target audience and market potential
3. Key features and functionality
4. Technology stack recommendations

Then, add these two important sections:
1. Recommended Package:
   - Based on the complexity and requirements, suggest one of our packages:
   For Apps:
   - Starter App ($1,350): Basic functionality, auth, mobile-responsive
   - Growth App ($3,150): Advanced features, custom auth, real-time functionality
   - Custom AI-Powered App ($6,300): AI/ML integration, custom algorithms
   For Websites:
   - Starter Website ($450): Modern design, up to 5 pages, basic SEO
   - Growth Website ($1,050): Premium design, up to 10 pages, e-commerce ready
   - Custom AI-Powered Website ($2,450): AI content generation, dynamic personalization
   
2. Monetization Potential:
   - Briefly suggest 2-3 ways the product could generate revenue
   - Focus on practical, achievable monetization strategies

Keep the output concise and focused. Use bullet points for clarity. Avoid discussing timelines or detailed deliverables.`
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
      setProcessedIdea(data.choices[0].message.content);
      setShowResults(true);
    } catch (error) {
      console.error('Error processing idea:', error);
      setProcessedIdea('Error processing your idea. Please try again.');
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
                  className="text-2xl font-bold leading-6 text-white mb-4"
                >
                  Tell Us About Your Vision
                </Dialog.Title>

                {!showResults ? (
                  <>
                    <p className="text-slate-200 mb-6">
                      Please describe your vision for your website or app. Here are some details you might want to include:
                      <br /><br />
                      <em className="text-custom-blue">Pro Tip: Don't worry about being precise! This should just be a "brain dump". The longer you ramble about your vision - the better.</em>
                      <br /><br />
                      • Your business name and what it's about<br />
                      • Your target audience<br />
                      • The main goals for your website or app<br />
                      • Key features or functionalities you want<br />
                      • Any design preferences or inspirations<br />
                      • Your timeline and budget<br />
                      • Any specific challenges or requirements
                    </p>

                    <div className="space-y-4">
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
                          {isProcessing ? 'Processing...' : 'Process'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    {isEditing ? (
                      <textarea
                        value={processedIdea}
                        onChange={(e) => setProcessedIdea(e.target.value)}
                        className="w-full h-96 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-custom-blue focus:border-transparent transition-colors"
                      />
                    ) : (
                      <div className="w-full h-96 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white overflow-y-auto whitespace-pre-wrap">
                        {processedIdea}
                      </div>
                    )}

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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
