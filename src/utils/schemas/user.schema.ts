import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().max(100),
  bio: z.string().max(200).optional(),
  bannerURL: z.instanceof(FileList).optional(),
  avatar: z.instanceof(FileList).optional(),
});

export type UpdateProfileSchemaDTO = z.infer<typeof updateProfileSchema>;
