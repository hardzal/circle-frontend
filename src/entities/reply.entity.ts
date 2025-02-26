import { ThreadEntity } from './thread.entity';
import { UserEntity } from './user.entity';

export interface ReplyEntity {
  id: string;
  content: string;
  thread?: ThreadEntity;
  user?: UserEntity;
  createdAt: string;
  updatedAt: string;
}
