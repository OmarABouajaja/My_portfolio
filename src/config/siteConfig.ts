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
  jobTitle: "Full-Stack Developer | Freelancer | IoT & Robotics Innovator",

  /** Resume PDF job title (may differ slightly) */
  resumeTitle: "Full-Stack Developer & IoT Engineer",

  /** Public-facing email (fallback when DB is offline) */
  email: "omarbouajaja48@gmail.com",

  /** Canonical website URL */
  url: "https://omarabouajaja.site",

  /** Social links */
  github: "https://github.com/Omar-ABouajaja",
  linkedin: "https://linkedin.com/in/omar-abouajaja",

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
    "Full-Stack Web Development", "IoT", "Embedded Systems", "Robotics",
    "React", "Next.js", "FastAPI", "Python", "TypeScript", "JavaScript",
    "Node.js", "Supabase", "SQL", "C++", "Arduino", "ESP32",
    "Tailwind CSS", "PHP", "Figma", "Blender", "Adobe Photoshop",
    "UI/UX Design", "Brand Identity", "Digital Marketing",
  ],

  /** Resume skill matrix */
  skills: {
    frontend: "TypeScript, React.js, Next.js, Tailwind CSS, JavaScript, Framer Motion",
    backend: "Python, FastAPI, PHP, Node.js, Supabase, PostgreSQL, SQL, REST APIs",
    hardware: "C++, Arduino, ESP32, Embedded Systems, Robotics, Circuit Design, IoT",
    design: "Figma, Adobe Photoshop, Canva, Blender, UI/UX, Brand Identity",
  },

  /** Resume summary */
  resumeSummary:
    "Passionate about computing since childhood, I built a self-taught path merging advanced software development with hardware innovation. Operating as a freelance developer since 2023, I deliver concrete digital solutions, from operational optimization to dynamic e-commerce ecosystems. My software engineering is backed by deep expertise in embedded systems, recognized by a Gold Medal at the National IoT Congress.",

  /** Resume contact line */
  resumeContact: "omarbouajaja48@gmail.com  |  github.com/Omar-ABouajaja  |  linkedin.com/in/omar-abouajaja",

  /** Admin panel branding */
  adminTitle: "Command Center",

  /** Client portal branding */
  clientPortalTitle: "Client Portal",
} as const;
