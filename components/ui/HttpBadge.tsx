import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

interface HttpBadgeProps {
  method: HttpMethod;
  endpoint: string;
  label?: string; // Optional descriptive label
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  active?: boolean;
  isLoading?: boolean;
  className?: string;
}

const methodColors: Record<HttpMethod, string> = {
  GET: "var(--get)",
  POST: "var(--post)",
  PATCH: "var(--patch)",
  DELETE: "var(--delete)",
  PUT: "var(--put)",
};

const methodBgColors: Record<HttpMethod, string> = {
  GET: "rgba(0, 229, 160, 0.07)",
  POST: "rgba(77, 156, 255, 0.07)",
  PATCH: "rgba(255, 179, 71, 0.07)",
  DELETE: "rgba(255, 92, 106, 0.07)",
  PUT: "rgba(199, 125, 255, 0.07)",
};

export default function HttpBadge({
  method,
  endpoint,
  label,
  href,
  onClick,
  active,
  isLoading,
  className = "",
}: HttpBadgeProps) {
  const pathname = usePathname();
  const isActive = active !== undefined ? active : (href ? pathname === href : false);
  const color = methodColors[method];
  const bgColor = isActive ? methodBgColors[method] : "transparent";

  const content = (
    <span className="flex items-center gap-2 group transition-all duration-300">
      <span
        className="relative font-bold text-xs px-2 py-0.5 rounded-sm transition-all duration-300 min-w-[32px] flex items-center justify-center"
        style={{
          color: isActive ? "#000" : color,
          backgroundColor: isActive ? color : methodBgColors[method],
          border: `1px solid ${color}`,
          textShadow: isActive ? "none" : `0 0 8px ${color}40`,
        }}
      >
        {isLoading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          method
        )}
      </span>
      <div className="flex flex-col items-start">
        <span
          className={`font-mono text-sm transition-colors duration-300 leading-tight ${
            isActive ? "text-[var(--bg)]" : "text-[var(--muted)] group-hover:text-[var(--text)]"
          }`}
        >
          {endpoint}
        </span>
        {label && (
          <span className={`text-[9px] uppercase tracking-tighter font-bold opacity-0 group-hover:opacity-70 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 ${isActive ? "text-[var(--bg)]" : "text-[var(--muted)]"}`}>
            {label}
          </span>
        )}
      </div>
    </span>
  );

  const containerClasses = `inline-flex items-center rounded-md px-3 py-1.5 transition-all duration-300 cursor-pointer ${className}`;
  const containerStyles = {
    backgroundColor: bgColor,
    border: `1px solid ${isActive ? color : "transparent"}`,
  };

  if (href) {
    return (
      <Link href={href} className={containerClasses} style={containerStyles} onClick={onClick as any}>
        {content}
      </Link>
    );
  }

  return (
    <button className={containerClasses} style={containerStyles} onClick={onClick as any}>
      {content}
    </button>
  );
}
