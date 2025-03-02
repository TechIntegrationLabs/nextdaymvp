import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  messages: string[];
  loop?: boolean;
  typingSpeed?: number;
  erasingSpeed?: number;
  delayBetweenMessages?: number;
}

export function TypingAnimation({
  messages,
  loop = false,
  typingSpeed = 50,
  erasingSpeed = 30,
  delayBetweenMessages = 1500
}: TypingAnimationProps) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDelaying, setIsDelaying] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isDelaying) {
      timeout = setTimeout(() => {
        setIsDelaying(false);
        setIsTyping(false);
      }, delayBetweenMessages);
      return () => clearTimeout(timeout);
    }

    if (isTyping) {
      if (currentText.length < messages[currentIndex].length) {
        timeout = setTimeout(() => {
          setCurrentText(messages[currentIndex].slice(0, currentText.length + 1));
        }, typingSpeed);
      } else {
        setIsDelaying(true);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, erasingSpeed);
      } else {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= messages.length) {
          if (loop) {
            nextIndex = 0;
          } else {
            nextIndex = messages.length - 1;
            setIsTyping(true);
            return;
          }
        }
        setCurrentIndex(nextIndex);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isTyping, isDelaying, currentIndex, messages, loop, typingSpeed, erasingSpeed, delayBetweenMessages]);

  return (
    <div className="flex items-center">
      <span>{currentText}</span>
      <span className="inline-block h-5 w-0.5 ml-1 bg-white animate-pulse"></span>
    </div>
  );
}
