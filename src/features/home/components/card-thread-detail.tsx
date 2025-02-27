import { likeLogo, likeLogoOutline, replyLogoOutline } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import { Box, Button, Image, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateLikeSchemaDTO,
  DeleteLikeSchemaDTO,
} from '@/utils/schemas/like.schema';
import { api } from '@/libs/api';
import { isAxiosError } from 'axios';
import { toaster } from '@/components/ui/toaster';
import { LikeResponse } from '@/features/like/dto/like';
import { Thread } from '@/features/thread/types/thread';

export default function CardThreadDetail(thread: Thread) {
  const { threadId } = useParams();
  const queryClient = useQueryClient();

  const { isPending: isPendingLike, mutateAsync: mutateLike } = useMutation<
    LikeResponse,
    Error,
    CreateLikeSchemaDTO
  >({
    mutationKey: ['like'],
    mutationFn: async (data: CreateLikeSchemaDTO) => {
      const response = await api.post(`/likes`, data);

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
        queryKey: [`threads/${threadId}`],
      });
    },
  });

  const { isPending: isPendingUnlike, mutateAsync: mutateUnlike } = useMutation<
    LikeResponse,
    Error,
    DeleteLikeSchemaDTO
  >({
    mutationKey: ['unlike'],
    mutationFn: async (data: DeleteLikeSchemaDTO) => {
      const response = await api.delete<LikeResponse>(
        `/likes/${data.threadId}`
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
        queryKey: [`threads/${threadId}`],
      });
    },
  });

  async function onLike(data: CreateLikeSchemaDTO) {
    await mutateLike(data);
  }

  async function onUnlike(data: DeleteLikeSchemaDTO) {
    await mutateUnlike(data);
  }

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      gap={'16px'}
      borderBottom={'1px solid'}
      borderColor={'outline'}
      padding={'16px 0px'}
    >
      <Box display={'flex'} gap={'4px'}>
        <Avatar
          name={thread.user?.profile?.fullName || ''}
          src={thread.user?.profile?.avatar || ''}
          shape="full"
          size="full"
          width={'50px'}
          height={'50px'}
        />
        <Box>
          <Text fontWeight={'bold'}>{thread.user?.profile?.fullName}</Text>
          <Text color={'secondary'}>@{thread.user?.username}</Text>
        </Box>
      </Box>

      <Box display={'flex'} flexDirection={'column'} gap={'4px'}>
        <Text>{thread.content}</Text>

        <Text color={'secondary'} padding={'10px'}>
          {new Date(thread.createdAt).getHours()} hour ago
        </Text>

        <Box display={'flex'}>
          <Button
            variant={'ghost'}
            display={'flex'}
            gap={'4px'}
            color={'secondary'}
            disabled={isPendingLike || isPendingUnlike}
            onClick={() =>
              thread.isLiked
                ? onUnlike({ threadId: thread.id })
                : onLike({ threadId: thread.id })
            }
          >
            <Image
              src={thread.isLiked ? likeLogo : likeLogoOutline}
              width={'27px'}
            />
            <Text>{thread.likesCount}</Text>
          </Button>
          <Button
            variant={'ghost'}
            display={'flex'}
            gap={'4px'}
            color={'secondary'}
          >
            <Image src={replyLogoOutline} width={'27px'} />
            <Text>{thread.repliesCount}</Text>
            <Text>Replies</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
