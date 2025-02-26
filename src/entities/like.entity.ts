import { ThreadEntity } from './thread.entity';
import { UserEntity } from './user.entity';

export interface LikeEntity {
  id: string;
  content?: string;
  thread?: ThreadEntity;
  user?: UserEntity;
  createdAt: string;
  updatedAt: string;
}
