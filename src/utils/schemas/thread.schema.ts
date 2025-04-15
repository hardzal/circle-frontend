import { z } from 'zod';

export const createThreadSchema = z
  .object({
    content: z.string().max(200),
    images: z.instanceof(FileList).optional(),
  })
  .refine((data) => data.images?.length || data.content, {
    message: 'Salah satu dari images or content harus terisi',
    path: ['content'], // bisa juga ['images']
  });

export type CreateThreadSchemaDTO = z.infer<typeof createThreadSchema>;

export const deleteThreadSchema = z.object({
  id: z.string().uuid(),
});

export type DeleteThreadSchemaDTO = z.infer<typeof deleteThreadSchema>;

export const updateThreadSchema = z
  .object({
    content: z.string().max(200),
    images: z.instanceof(FileList).optional(),
  })
  .refine((data) => data.images?.length || data.content, {
    message: 'Salah satu dari images or content harus terisi',
    path: ['content'], // bisa juga ['images']
  });

export type UpdateThreadSchemaDTO = z.infer<typeof updateThreadSchema>;
