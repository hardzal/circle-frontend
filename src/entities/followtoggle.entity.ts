import { UserEntity } from './user.entity';

export interface FollowToggleEntity {
  id: string;
  followedId: string;
  followingId: string;

  following?: UserEntity;
  followingCount?: number;
  isFollowing?: boolean;

  followed?: UserEntity;
  followedCount?: number;
  isFollowed: boolean;

  createdAt: string;
  updatedAt: string;
}
