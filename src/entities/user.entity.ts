import { Thread } from '@/features/thread/types/thread';
import { ProfileEntity } from './profile.entity';
export interface UserEntity {
  id: string;
  email: string;
  username: string;
  profile?: ProfileEntity;
  threads?: Thread[];
  createdAt?: string;
  updatedAt?: string;
}
