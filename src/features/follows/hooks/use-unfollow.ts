import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FollowResponse } from '../dto/follow';
import { DeleteFollowSchemaDTO } from '@/utils/schemas/follow.schema';
import { api } from '@/libs/api';
import { isAxiosError } from 'axios';
import { toaster } from '@/components/ui/toaster';

export function useUnfollow() {
  const queryClient = useQueryClient();

  const { isPending: isPendingUnfollow, mutateAsync: mutateUnfollow } =
    useMutation<FollowResponse, Error, DeleteFollowSchemaDTO>({
      mutationKey: ['userUnfollow'],
      mutationFn: async (data: DeleteFollowSchemaDTO) => {
        const response = await api.delete<FollowResponse>(
          `/follows/${data.followedId}`
        );
        console.log('unfollow', response.data.data);
        return response.data;
      },

      onError: (error) => {
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
          queryKey: ['followings'],
        });

        return toaster.create({
          title: 'Done unfollow',
          type: 'success',
        });
      },
    });

  async function onUnfollow(data: DeleteFollowSchemaDTO) {
    await mutateUnfollow(data);
  }

  return {
    isPendingUnfollow,
    onUnfollow,
  };
}
