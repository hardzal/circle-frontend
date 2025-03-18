import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FollowResponse } from '../dto/follow';
import { CreateFollowSchemaDTO } from '@/utils/schemas/follow.schema';
import { api } from '@/libs/api';
import { isAxiosError } from 'axios';
import { toaster } from '@/components/ui/toaster';

export function useFollow(userId: string) {
  const queryClient = useQueryClient();

  const { isPending: isPendingFollow, mutateAsync: mutateFollow } = useMutation<
    FollowResponse,
    Error,
    CreateFollowSchemaDTO
  >({
    mutationKey: ['userFollow'],
    mutationFn: async (data: CreateFollowSchemaDTO) => {
      const response = await api.post<FollowResponse>(
        `/follows/${userId}`,
        data
      );

      return response.data;
    },

    onError: (error: Error) => {
      if (isAxiosError(error)) {
        return toaster.create({
          title: error.response?.data.message,
          type: 'error',
        });
      }

      toaster.create({
        title: 'Something went wrong!',
        type: 'error',
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['followers'],
      });
    },
  });

  async function onFollow(data: CreateFollowSchemaDTO) {
    await mutateFollow(data);
  }

  return {
    isPendingFollow,
    onFollow,
  };
}
