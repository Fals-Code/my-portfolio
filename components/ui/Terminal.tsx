"use client";

import React, { useEffect, useState } from "react";

interface TerminalProps {
  content: string;
  typing?: boolean;
  typingSpeed?: number;
  className?: string;
  title?: string;
}

export default function Terminal({
  content,
  typing = false,
  typingSpeed = 20,
  className = "",
  title = "bash",
}: TerminalProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(typing);

  useEffect(() => {
    if (!typing) {
      setDisplayedContent(content);
      return;
    }

    let i = 0;
    setIsTyping(true);
    setDisplayedContent("");
    
    const intervalId = setInterval(() => {
      setDisplayedContent((prev) => {
        const nextChar = content.charAt(i);
        return prev + nextChar;
      });
      
      i++;
      if (i >= content.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => clearInterval(intervalId);
  }, [content, typing, typingSpeed]);

  // Simple syntax highlighter for JSON
  const renderHighlightedJson = (text: string) => {
    if (!text.trim().startsWith("{")) return text;

    try {
      // Just a naive regex-based replacement for visual effect. 
      // Only do this if we look like JSON.
      let html = text
        // Highlight strings
        .replace(/"([^"]*)"/g, '<span style="color: var(--get)">"$1"</span>')
        // Highlight keys (string followed by colon)
        .replace(/<span style="color: var\(--get\)">"([^"]*)"<\/span>:/g, '<span style="color: var(--post)">"$1"</span>:')
        // Highlight numbers
        .replace(/: (-?\d+\.?\d*)/g, ': <span style="color: var(--patch)">$1</span>')
        // Highlight booleans
        .replace(/: (true|false)/g, ': <span style="color: var(--delete)">$1</span>');

      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return text;
    }
  };

  return (
    <div className={`rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl flex flex-col ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-card2)]">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[var(--delete)]/80" />
          <div className="w-3 h-3 rounded-full bg-[var(--patch)]/80" />
          <div className="w-3 h-3 rounded-full bg-[var(--get)]/80" />
        </div>
        <div className="mx-auto text-xs text-[var(--muted)] font-mono">{title}</div>
        <div className="w-12" /> {/* Spacer to balance flex-1 */}
      </div>
      
      {/* Terminal Body */}
      <div className="p-4 overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap relative">
        {renderHighlightedJson(displayedContent)}
        {isTyping && (
          <span className="inline-block w-2 h-4 ml-1 bg-[var(--text)] animate-pulse" />
        )}
      </div>
    </div>
  );
}
