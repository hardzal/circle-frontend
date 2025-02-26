export type ThreadResponse = {
  message: string;
  data: {
    id: string;
    content: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  };
};
