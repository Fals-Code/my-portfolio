"use client";

import { useEffect, useRef, RefObject } from "react";

/**
 * Custom hook to reveal elements as they enter the viewport using IntersectionObserver.
 * 
 * @param ref - Ref to the element to watch or a selector string.
 * @returns ref - The ref that can be attached to the container element.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add 'revealed' class
            entry.target.classList.add("revealed");
            
            // Handle delay classes if any
            const target = entry.target as HTMLElement;
            if (target.classList.contains("delay-1")) target.style.transitionDelay = "100ms";
            if (target.classList.contains("delay-2")) target.style.transitionDelay = "200ms";
            if (target.classList.contains("delay-3")) target.style.transitionDelay = "300ms";
            if (target.classList.contains("delay-4")) target.style.transitionDelay = "400ms";

            // Stop observing after reveal (one-shot)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return elementRef;
}
