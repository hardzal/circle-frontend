import { likeLogo, likeLogoOutline } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import { Box, Button, Image, Text } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LikeReplyResponse } from '@/features/like/dto/like';
import { api } from '@/libs/api';
import {
  CreateLikeReplySchemaDTO,
  DeleteLikeReplySchemaDTO,
} from '@/utils/schemas/likereply.schema';
import { isAxiosError } from 'axios';
import { toaster } from '@/components/ui/toaster';
import { Reply } from '@/features/reply/types/reply';
import { formatDistanceToNowStrict } from 'date-fns';

export default function CardReply(reply: Reply) {
  console.log(reply);
  const queryClient = useQueryClient();
  // custom hooks like
  const { isPending: isPendingLike, mutateAsync: mutateLike } = useMutation<
    LikeReplyResponse,
    Error,
    CreateLikeReplySchemaDTO
  >({
    mutationKey: ['likeReply'],
    mutationFn: async (data: CreateLikeReplySchemaDTO) => {
      const response = await api.post<LikeReplyResponse>(`/likereplies`, data);

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
        queryKey: ['threads'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['replyData'],
      });

      toaster.create({
        title: 'reply liked!',
        type: 'success',
      });
    },
  });

  // hooks mutation unlike
  const { isPending: isPendingUnlike, mutateAsync: mutateUnlike } = useMutation<
    LikeReplyResponse,
    Error,
    DeleteLikeReplySchemaDTO
  >({
    mutationKey: ['unlikeReply'],
    mutationFn: async (data: DeleteLikeReplySchemaDTO) => {
      const response = await api.delete<LikeReplyResponse>(
        `/likereplies/${data.replyId}`
      );

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
        queryKey: ['threads'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['replyData'],
      });
    },
  });

  async function onLike(data: CreateLikeReplySchemaDTO) {
    await mutateLike(data);
  }

  async function onUnLike(data: DeleteLikeReplySchemaDTO) {
    await mutateUnlike(data);
  }

  return (
    <Box
      display={'flex'}
      gap={'16px'}
      borderBottom={'1px solid'}
      borderColor={'outline'}
      padding={'30px 20px'}
    >
      <Avatar
        name={reply.user?.profile?.fullName || ''}
        src={reply.user?.profile?.avatar || ''}
        shape="full"
        size="full"
        width={'50px'}
        height={'50px'}
      />

      <Box display={'flex'} flexDirection={'column'} gap={'4px'}>
        <Box display={'flex'} gap={'4px'}>
          <Text fontWeight={'bold'}>{reply.user?.profile?.fullName}</Text>
          <Text color={'secondary'}>@{reply.user?.username}</Text>
          <Text color={'secondary'}>•</Text>
          <Text color={'secondary'}>
            {' '}
            {formatDistanceToNowStrict(new Date(reply.createdAt).getTime(), {
              addSuffix: true,
            })}
          </Text>
        </Box>
        <Text cursor={'pointer'}>{reply.content}</Text>
        <Box display={'flex'}>
          <Button
            variant={'ghost'}
            display={'flex'}
            gap={'4px'}
            disabled={isPendingLike || isPendingUnlike}
            onClick={() =>
              reply.isLiked
                ? onUnLike({ replyId: reply.id })
                : onLike({ replyId: reply.id })
            }
          >
            <Image
              src={reply.isLiked ? likeLogo : likeLogoOutline}
              width={'27px'}
            />
            <Text>{reply.likesCount}</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
