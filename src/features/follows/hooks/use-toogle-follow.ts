import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FollowResponse } from '../dto/follow';
import { ToggleFollowSchemaDTO } from '@/utils/schemas/follow.schema';
import { api } from '@/libs/api';
import { toaster } from '@/components/ui/toaster';
import { isAxiosError } from 'axios';

export function useToggleFollow(userId: string) {
  const queryClient = useQueryClient();

  const { isPending: isPendingToggleFollow, mutateAsync: mutateToggleFollow } =
    useMutation<FollowResponse, Error, ToggleFollowSchemaDTO>({
      mutationKey: ['toggleFollow'],
      mutationFn: async ({
        followedId,
        isFollowing,
      }: {
        followedId: string;
        isFollowing: boolean;
      }) => {
        if (isFollowing) {
          const response = await api.post<FollowResponse>(
            `/follows/${userId}`,
            followedId
          );

          return response.data;
        } else {
          const response = await api.delete<FollowResponse>(
            `/follows/${followedId}`
          );

          return response.data;
        }
      },

      onError: (error: Error) => {
        if (isAxiosError(error)) {
          console.log('follow back', error.response?.data);

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
        await queryClient.invalidateQueries({
          queryKey: ['following'],
        });
      },
    });

  async function onToggleFollow(data: ToggleFollowSchemaDTO) {
    await mutateToggleFollow(data);
  }

  return {
    onToggleFollow,
    isPendingToggleFollow,
  };
}
