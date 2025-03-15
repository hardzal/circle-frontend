import { UserEntity } from './user.entity';

export interface FollowedEntity {
  id: string;
  followedId: string;
  followingId: string;
  following?: UserEntity;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
}
