import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

interface HttpBadgeProps {
  method: HttpMethod;
  endpoint: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  active?: boolean;
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
  href,
  onClick,
  active,
  className = "",
}: HttpBadgeProps) {
  const pathname = usePathname();
  const isActive = active !== undefined ? active : (href ? pathname === href : false);
  const color = methodColors[method];
  const bgColor = isActive ? methodBgColors[method] : "transparent";

  const content = (
    <span className="flex items-center gap-2 group transition-all duration-300">
      <span
        className="font-bold text-xs px-2 py-0.5 rounded-sm transition-all duration-300"
        style={{
          color: isActive ? "#000" : color,
          backgroundColor: isActive ? color : methodBgColors[method],
          border: `1px solid ${color}`,
          textShadow: isActive ? "none" : `0 0 8px ${color}40`,
        }}
      >
        {method}
      </span>
      <span
        className={`font-mono text-sm transition-colors duration-300 ${
          isActive ? "text-[var(--bg)]" : "text-[var(--muted)] group-hover:text-[var(--text)]"
        }`}
      >
        {endpoint}
      </span>
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
