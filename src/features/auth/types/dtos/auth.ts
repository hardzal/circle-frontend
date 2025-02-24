import { UserEntity } from '@/entities/user.entity';

type User = UserEntity & {
  fullName: string;
};

export type RegisterDTO = Pick<User, 'fullName' | 'email' | 'password'>;

export type LoginDTO = Pick<User, 'email' | 'password'>;
