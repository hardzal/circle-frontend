import { z } from 'zod';

export const createFollowSchema = z.object({
  followedId: z.string().uuid(),
});

export type CreateFollowSchemaDTO = z.infer<typeof createFollowSchema>;

export const deleteFollowSchema = z.object({
  followedId: z.string().uuid(),
});

export type DeleteFollowSchemaDTO = z.infer<typeof deleteFollowSchema>;

export const toggleFollowSchema = z.object({
  followedId: z.string().uuid(),
  isFollowing: z.boolean(),
});

export type ToggleFollowSchemaDTO = z.infer<typeof toggleFollowSchema>;
