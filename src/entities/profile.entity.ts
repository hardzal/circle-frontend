export interface ProfileEntity {
  id: string;
  fullName: string;
  avatarUrl: string | undefined;
  bannerUrl: string | undefined;
  bio: string | undefined;
  createdAt: string;
  updatedAt: string;
}
