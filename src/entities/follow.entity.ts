import { UserEntity } from './user.entity';

export interface FollowEntity {
  id: string;
  content: string;
  followed?: UserEntity;
  following?: UserEntity;
  createdAt: string;
  updatedAt: string;
}
