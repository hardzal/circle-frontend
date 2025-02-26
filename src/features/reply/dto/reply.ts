export type ReplyResponse = {
  message: string;
  data: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
};
