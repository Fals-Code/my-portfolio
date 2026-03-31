export type Theme = "light" | "dark";

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  caseStudy?: string | null;
  image?: string;
  badge?: string | null;
  featured?: boolean;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
  tech?: string[];
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  place: string;
  description: string;
  type: "work" | "education";
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface GitHubStats {
  repositories: number;
  followers: number;
  stars: number;
}

export interface GitHubLanguage {
  name: string;
  color: string;
  percentage: number;
  bytes: number;
}

export interface ContactData {
  email: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  instagram: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface CaseStudy {
  slug: string;
  badge: string;
  badgeIcon: string;
  badgeColor?: string;
  title: string;
  subtitle: string;
  heroImage?: string;
  meta: (string | number)[];
  github: string;
  kpis: string[];
  challenge: string;
  solution: string;
  schema?: string;
  techStack: string[];
  features: {
    icon: string;
    color: string;
    title: string;
    desc?: string;
  }[];
}
