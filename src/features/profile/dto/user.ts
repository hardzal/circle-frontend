import { ProfileEntity } from '@/entities/profile.entity';

export type UserResponse = {
  message: string;
  data?: ProfileEntity;
};
