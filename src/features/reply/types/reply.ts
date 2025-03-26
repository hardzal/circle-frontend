import { ReplyEntity } from '@/entities/reply.entity';

export type Reply = ReplyEntity & {
  likesCount: number;
  isLiked: boolean;
};
