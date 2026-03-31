import { CaseStudy } from "@/types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "rshp",
    badge: "Healthcare Tech",
    badgeIcon: "hospital",
    title: "RSHP – Hospital Info System",
    subtitle: "Digitalizing patient registration and doctor scheduling with real-time data integration.",
    meta: [2024, "Laravel + MySQL", "Academic Project"],
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
  }
];
