import { LikeEntity } from './like.entity';
import { ThreadEntity } from './thread.entity';
import { UserEntity } from './user.entity';

export interface ReplyEntity {
  id: string;
  content: string;
  thread?: ThreadEntity;
  user?: UserEntity;
  likes?: LikeEntity[];
  createdAt: string;
  updatedAt: string;
}
