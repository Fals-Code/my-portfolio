import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "rshp",
    title: "RSHP – Hospital Info System",
    description: "Digitalizing patient registration and doctor scheduling with real-time integration.",
    tags: ["laravel", "fullstack"],
    badge: "featured",
    icon: "hospital",
    iconBg: "rgba(232,83,58,0.15)",
    iconColor: "var(--accent)",
    tech: ["Laravel", "MySQL", "Eloquent", "PHP"],
    github: "https://github.com/Fals-Code/Proyek_RSHPV1",
    caseStudy: "/projects/rshp",
    featured: true
  },
  {
    id: "warehouse",
    title: "Warehouse Inventory System",
    description: "Automated stock management with DB transactions & audit trails.",
    tags: ["laravel", "fullstack"],
    badge: null as string | null,
    icon: "warehouse",
    iconBg: "rgba(59,130,246,0.15)",
    iconColor: "#3b82f6",
    tech: ["Laravel", "MySQL", "Audit Trail"],
    github: "https://github.com/Fals-Code/Proyek_PBDV1",
    caseStudy: "/projects/warehouse"
  },
  {
    id: "book-collection",
    title: "Book Collection Manager",
    description: "Deep exploration of the Laravel ecosystem for personal library management.",
    tags: ["laravel", "wip"],
    badge: "wip",
    icon: "book",
    iconBg: "rgba(16,185,129,0.15)",
    iconColor: "#10b981",
    tech: ["Laravel", "Livewire"],
    github: "https://github.com/Fals-Code/Framework_koleksi_buku",
    caseStudy: null
  }
];
