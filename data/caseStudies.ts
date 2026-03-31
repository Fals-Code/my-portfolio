import { CaseStudy } from "@/types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "rshp",
    badge: "Healthcare Tech",
    badgeIcon: "hospital",
    title: "RSHP – Hospital Info System",
    subtitle: "Digitalizing patient registration and doctor scheduling with real-time data integration.",
    heroImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop",
    meta: [2025, "Laravel + MySQL", "Academic Project"],
    github: "https://github.com/Fals-Code/Proyek_RSHPV1",
    kpis: ["100% Paperless Ops", "Real-time Data Sync", "3 Core Modules", "Laravel Backend"],
    challenge: "Data pendaftaran pasien dan jadwal dokter sering bentrok karena kurangnya sinkronisasi real-time...",
    solution: "Membangun sistem validasi otomatis menggunakan Laravel & Eloquent...",
    schema: `
-- ERD Schema Snippet
CREATE TABLE appointments (
    id BIGINT PRIMARY KEY,
    patient_id FOREIGN KEY,
    doctor_id FOREIGN KEY,
    schedule_time DATETIME,
    status ENUM('pending', 'confirmed')
);
    `,
    techStack: ["laravel", "php", "mysql", "js", "github"],
    features: [
      { icon: "calendar-check", color: "var(--accent)", title: "Smart Scheduling", desc: "Auto-validates appointment conflicts." },
      { icon: "refresh-cw", color: "#3b82f6", title: "Real-time Sync", desc: "Live updates across patient and doctor queues." },
      { icon: "shield", color: "#10b981", title: "Data Integrity", desc: "Eloquent transactions ensure no duplicates." },
      { icon: "bar-chart", color: "#f59e0b", title: "Admin Dashboard", desc: "Reporting tools for patient flow management." }
    ]
  },
  {
    slug: "warehouse",
    badge: "Logistics Tech",
    badgeIcon: "boxes",
    badgeColor: "#3b82f6",
    title: "Warehouse Inventory System",
    subtitle: "Automated stock management with DB transactions & audit trails.",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
    meta: [2025, "Laravel + MySQL", "Academic Project"],
    github: "https://github.com/Fals-Code/Proyek_PBDV1",
    kpis: ["0% Data Loss Risk", "Auto Audit Logging", "4 Core Features", "ACID Compliance"],
    challenge: "Pencatatan manual sering menyebabkan selisih data stok...",
    solution: "Menggunakan Laravel Database Transactions untuk mengunci stok secara aman...",
    techStack: ["laravel", "php", "mysql", "github"],
    features: [
      { icon: "boxes", color: "#3b82f6", title: "Real-time Stock Tracking" },
      { icon: "history", color: "var(--accent)", title: "Automated Audit Trail" },
      { icon: "layers", color: "#10b981", title: "Batch Updates" },
      { icon: "lock", color: "#f59e0b", title: "Reliable DB Locking" }
    ]
  },
  {
    slug: "book-collection",
    badge: "Library Tech",
    badgeIcon: "book",
    badgeColor: "#10b981",
    title: "Book Collection Manager",
    subtitle: "Deep exploration of the Laravel ecosystem for personal library management.",
    heroImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop",
    meta: [2026, "Laravel + Livewire", "Work In Progress"],
    github: "https://github.com/Fals-Code/Framework_koleksi_buku",
    kpis: ["0", "Bugs", "1", "WIP Status", "10", "Livewire Components", "99", "Passion"],
    challenge: "Memahami dan menguji secara mendalam ekosistem TALL (Tailwind, Alpine, Laravel, Livewire) untuk membuat UI yang sangat reaktif tanpa menggunakan frontend framework terpisah seperti React/Vue.",
    solution: "Penerapan komponen Livewire V3 secara ekstensif untuk real-time searching, lazy loading, dan form validation, yang disatukan menggunakan arsitektur modular di Laravel.",
    techStack: ["laravel", "php", "mysql", "js", "github"],
    features: [
      { icon: "book", color: "#10b981", title: "Real-time Search", desc: "Livewire-powered instant book searching." },
      { icon: "database", color: "var(--accent)", title: "Modular Architecture", desc: "Clean separation of models and views." }
    ]
  }
];
