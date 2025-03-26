export type LikeResponse = {
  message: string;
  data: {
    id: string;
    userId: string;
    threadId: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type LikeReplyResponse = {
  message: string;
  data: {
    id: string;
    userId: string;
    threadId?: string;
    replyId: string;
    createdAt: string;
    updatedAt: string;
  };
};
