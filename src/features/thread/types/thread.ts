import { ThreadEntity } from '@/entities/thread.entity';

export type Thread = ThreadEntity & {
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
};
