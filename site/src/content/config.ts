import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        year: z.number(),
        stack: z.array(z.string()),
        url: z.string().url().optional(),
        image: z.string().optional(), // ruta en /public/images/...
        featured: z.boolean().default(false),
        description: z.string(),
    }),
});

export const collections = { projects };
