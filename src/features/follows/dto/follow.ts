export type FollowResponse = {
  message: string;
  data: {
    id: string;
    followedId: string;
    followingId: string;
    createdAt: string;
    updatedAt: string;
  };
};
