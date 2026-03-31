import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "web-dev",
    icon: "code",
    title: "Web Development",
    description: "Membangun aplikasi web fungsional dengan fokus pada struktur kode yang rapi menggunakan framework Laravel."
  },
  {
    id: "db-mgmt",
    icon: "database",
    title: "Database Management",
    description: "Merancang skema database relasional yang efisien dengan Eloquent ORM untuk integritas sistem."
  },
  {
    id: "sys-logic",
    icon: "terminal",
    title: "System Logic",
    description: "Menganalisis alur bisnis dan menerjemahkannya ke dalam logika backend yang solid."
  },
  {
    id: "tech-exp",
    icon: "rocket",
    title: "Tech Exploration",
    description: "Sangat antusias mengeksplorasi teknologi baru di ekosistem PHP/Laravel."
  }
];
