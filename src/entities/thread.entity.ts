import { Reply } from '@/features/reply/types/reply';
import { LikeEntity } from './like.entity';
import { UserEntity } from './user.entity';

export interface ThreadEntity {
  id: string;
  content: string;
  images: string;
  user?: UserEntity;
  likes?: LikeEntity[];
  replies?: Reply[];
  createdAt: string;
  updatedAt: string;
}
