"use client";

import { useState, useEffect } from "react";

interface TypewriterOptions {
  words: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
}

/**
 * Custom hook to create an infinite typewriter loop for an array of words.
 * 
 * @returns { displayText: string, isDeleting: boolean }
 */
export function useTypewriter({
  words,
  speed = 80,
  deleteSpeed = 50,
  pauseMs = 1500,
}: TypewriterOptions) {
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(speed);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing characters
        setDisplayText((prev) => currentWord.substring(0, prev.length + 1));
        setTypingSpeed(speed);

        if (displayText === currentWord) {
          // Pause at end of word
          setTimeout(() => setIsDeleting(true), pauseMs);
        }
      } else {
        // Deleting characters
        setDisplayText((prev) => currentWord.substring(0, prev.length - 1));
        setTypingSpeed(deleteSpeed);

        if (displayText === "") {
          // Finish deleting, move to next word
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex, words, speed, deleteSpeed, pauseMs, typingSpeed]);

  return { displayText, isDeleting };
}
