import { UserEntity } from './user.entity';

export interface FollowingEntity {
  id: string;
  followedId: string;
  followingId: string;
  followed?: UserEntity;
  followedCount: number;
  createdAt: string;
  updatedAt: string;
}
