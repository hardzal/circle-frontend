import { z } from 'zod';

export const createLikeReplySchema = z.object({
  replyId: z.string().uuid(),
});

export type CreateLikeReplySchemaDTO = z.infer<typeof createLikeReplySchema>;

export const deleteLikeReplySchema = z.object({
  replyId: z.string().uuid(),
});

export type DeleteLikeReplySchemaDTO = z.infer<typeof deleteLikeReplySchema>;
