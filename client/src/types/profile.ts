export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface Experience {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Post {
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
}

export interface ProfileUser {
  name: string;
  tagline: string;
  age?: number;
  location?: string;
  description: string;
  avatar?: string | null;
  skills: Array<{ name: string; level: string }>;
  certifications: string[];
  languages: Array<{ name: string; level: string }>;
}
