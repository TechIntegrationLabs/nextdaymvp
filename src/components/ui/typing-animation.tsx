import { useState, useEffect, useRef } from 'react';

export function TypingAnimation() {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  
  // More exaggerated, silly, and hyped-up messages with tech jargon
  const messages = [
    "Firing up the AI quantum processing unit...",
    "Activating neural hyperdrive boosters...",
    "Warming up the idea-to-code transponder matrix...",
    "Lubricating the digital idea hamster wheels...",
    "Charging the imagination particle accelerator...",
    "Calibrating the creative flux capacitors...",
    "Engaging the hyper-realistic vision fabricator...",
    "Unleashing the code ninjas from their digital dojo...",
    "Spinning up the cloud-native dream compiler...",
    "Initializing the quantum idea synthesizer...",
  ];

  // Super fast typing speed and message cycling
  const typingSpeed = 10; // much faster typing
  const erasingSpeed = 5; // much faster erasing
  const pauseBeforeErasing = 800; // much shorter pause before erasing
  const pauseBeforeNextMessage = 100; // almost no pause before next message
  
  const currentMessageRef = useRef(messages[0]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const typeNextCharacter = () => {
      currentMessageRef.current = messages[messageIndex];
      
      if (isTyping) {
        // Type 2-3 characters at a time for super speed
        if (displayText.length < currentMessageRef.current.length) {
          const charsToAdd = Math.min(3, currentMessageRef.current.length - displayText.length);
          setDisplayText(currentMessageRef.current.substring(0, displayText.length + charsToAdd));
          timerRef.current = setTimeout(typeNextCharacter, typingSpeed);
        } else {
          // Message complete, pause briefly before erasing
          timerRef.current = setTimeout(() => {
            setIsTyping(false);
            typeNextCharacter();
          }, pauseBeforeErasing);
        }
      } else {
        // Erase 3-4 characters at a time for super speed
        if (displayText.length > 0) {
          const charsToRemove = Math.min(4, displayText.length);
          setDisplayText(displayText.substring(0, displayText.length - charsToRemove));
          timerRef.current = setTimeout(typeNextCharacter, erasingSpeed);
        } else {
          // Message erased, move to next message with minimal pause
          const nextIndex = (messageIndex + 1) % messages.length;
          setMessageIndex(nextIndex);
          setIsTyping(true);
          timerRef.current = setTimeout(typeNextCharacter, pauseBeforeNextMessage);
        }
      }
    };

    timerRef.current = setTimeout(typeNextCharacter, pauseBeforeNextMessage);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [displayText, isTyping, messageIndex, messages]);

  return (
    <div className="h-6 flex items-center">
      <span className="text-white font-mono text-sm">
        {displayText}
        <span className="inline-block w-2 h-4 bg-white animate-blink ml-1"></span>
      </span>
    </div>
  );
}
