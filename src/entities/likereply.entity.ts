import { ReplyEntity } from './reply.entity';
import { UserEntity } from './user.entity';

export interface LikeReplyEntity {
  id: string;
  content?: string;
  reply?: ReplyEntity;
  user?: UserEntity;
  createdAt: string;
  updatedAt: string;
}
