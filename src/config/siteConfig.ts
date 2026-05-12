/**
 * Centralized site configuration — single source of truth for all
 * personal/branding constants. Update here to propagate everywhere.
 *
 * Dynamic values (hiring status, project counts, etc.) still come
 * from Supabase via useSiteMetadata(); this file covers the
 * "identity" layer that rarely changes but must stay consistent.
 */

export const SITE = {
  /** Display name */
  ownerName: "Omar Abouajaja",

  /** Terminal-style brand handle shown in navbars & console */
  brandHandle: "ABOUAJAJA_OMAR/",

  /** Primary job title */
  jobTitle: "Robotics, IoT & Full-Stack Engineer",

  /** Resume PDF job title (may differ slightly) */
  resumeTitle: "Senior Full-Stack & 3D Web Engineer",

  /** Public-facing email (fallback when DB is offline) */
  email: "omar.abouajaja@gmail.com",

  /** Canonical website URL */
  url: "https://omarabouajaja.com",

  /** Social links */
  github: "https://github.com/omarabouajaja",
  linkedin: "https://linkedin.com/in/omarabouajaja",

  /** Default resume file path (relative to public/) */
  resumePath: "/docs/Omar Abouajaja Resume.pdf",
  resumeFilename: "Omar_Abouajaja_Resume.pdf",

  /** Country/nationality for structured data */
  country: "Tunisia",
  nationality: "Tunisian",

  /** Supported languages */
  locales: ["en", "es", "fr", "ar"] as const,

  /** Known technical competencies (for SEO + resume) */
  competencies: [
    "Robotics", "IoT", "Embedded Systems", "Full-Stack Web Development",
    "React", "Node.js", "Arduino", "ESP32", "MQTT", "PostgreSQL",
    "TypeScript", "TailwindCSS", "Supabase", "Cloud Architecture",
  ],

  /** Resume skill matrix */
  skills: {
    frontend: "React, Three.js, WebGL, TailwindCSS, TypeScript, Framer Motion",
    backend: "Node.js, Supabase, PostgreSQL, REST APIs, Web Crypto",
    hardware: "IoT, ESP32, Serial Comms, Python",
  },

  /** Resume summary */
  resumeSummary:
    "A highly driven engineer specializing in building hyper-futuristic operating systems, immersive 3D web applications, and robust full-stack architectures. Passionate about merging industrial cyber aesthetics with extreme utility.",

  /** Resume contact line */
  resumeContact: "omar.abouajaja@gmail.com  |  github.com/omarabouajaja  |  omarabouajaja.com",

  /** Admin panel branding */
  adminTitle: "Command Center",

  /** Client portal branding */
  clientPortalTitle: "Client Portal",
} as const;
