import { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextType {
  message: string;
  setMessage: (message: string) => void;
  appSiteDetails: string;
  setAppSiteDetails: (appSiteDetails: string) => void;
  originalTranscript: string;
  setOriginalTranscript: (originalTranscript: string) => void;
  generatedImageUrl: string;
  setGeneratedImageUrl: (generatedImageUrl: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [appSiteDetails, setAppSiteDetails] = useState('');
  const [originalTranscript, setOriginalTranscript] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  return (
    <MessageContext.Provider value={{ 
      message, 
      setMessage, 
      appSiteDetails, 
      setAppSiteDetails,
      originalTranscript,
      setOriginalTranscript,
      generatedImageUrl,
      setGeneratedImageUrl
    }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}
