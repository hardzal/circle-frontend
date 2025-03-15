export interface ProfileEntity {
  id: string;
  fullName: string;
  avatar: string | undefined;
  bannerURL: string | undefined;
  bio: string | undefined;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
