import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    year: z.number(),
    stack: z.array(z.string()),
    url: z.string().url().optional(),
    image: z.string().optional(), // ruta en /public/images/...
    featured: z.boolean().default(false),
    description: z.string(),
    // Projects.astro ya renderiza estos dos; sin declararlos aquí Zod los
    // descartaba y el bloque nunca se mostraba.
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    // Campos opcionales nuevos: la tarjeta solo los renderiza si existen,
    // así los 9 proyectos que no los definen quedan exactamente igual.
    sector: z.string().optional(),
    status: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    serviceUrl: z.string().url().optional(),
    // Logo real del cliente/proyecto (PNG/WebP con transparencia), en
    // /public/images/logos/. Si no existe, la tarjeta cae de vuelta al
    // icono genérico (ver meta en Projects.astro) — ningún proyecto se
    // rompe por no tener logo todavía.
    logo: z.string().optional(),
  }),
});

export const collections = { projects };
