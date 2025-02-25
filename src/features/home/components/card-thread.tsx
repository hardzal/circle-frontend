import { likeLogo, likeLogoOutline, replyLogoOutline } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import { Box, BoxProps, Button, Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Thread } from '../types/posts';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreateLikeSchemaDTO,
  DeleteLikeSchemaDTO,
} from '@/utils/schemas/like.schema';
import { api } from '@/libs/api';
import { isAxiosError } from 'axios';
import { toaster } from '@/components/ui/toaster';

interface CardThreadProps extends BoxProps {
  threadData: Thread;
}

interface LikeResponse {
  message: string;
  data: {
    id: string;
    userId: string;
    threadId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export default function CardThread({ threadData }: CardThreadProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function onClickCard() {
    navigate(`/thread/${threadData.id}`);
  }

  // custom hooks like
  const { isPending: isPendingLike, mutateAsync: mutateLike } = useMutation<
    LikeResponse,
    Error,
    CreateLikeSchemaDTO
  >({
    mutationKey: ['like'],
    mutationFn: async (data: CreateLikeSchemaDTO) => {
      const response = await api.post<LikeResponse>(`/likes`, data);

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
    },
  });

  // hooks mutation unlike
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
        queryKey: ['threads'],
      });
    },
  });

  async function onLike(data: CreateLikeSchemaDTO) {
    await mutateLike(data);
  }

  async function onUnLike(data: DeleteLikeSchemaDTO) {
    await mutateUnlike(data);
  }

  return (
    <Box
      display={'flex'}
      gap={'16px'}
      borderBottom={'1px solid'}
      borderColor={'outline'}
      padding={'16px'}
    >
      <Avatar
        name={threadData.user.fullName}
        src={threadData.user.avatarUrl}
        shape="full"
        size="full"
        width={'50px'}
        height={'50px'}
      />

      <Box display={'flex'} flexDirection={'column'} gap={'4px'}>
        <Box display={'flex'} gap={'4px'}>
          <Text fontWeight={'bold'}>{threadData.user.fullName}</Text>
          <Text color={'secondary'}>@{threadData.user.username}</Text>
          <Text color={'secondary'}>•</Text>
          <Text color={'secondary'}>
            {' '}
            {new Date(threadData.createdAt).getHours()}h h
          </Text>
        </Box>
        <Text cursor={'pointer'} onClick={onClickCard}>
          {threadData.content}
        </Text>
        <Box display={'flex'}>
          <Button
            variant={'ghost'}
            display={'flex'}
            gap={'4px'}
            disabled={isPendingLike || isPendingUnlike}
            onClick={() =>
              threadData.isLiked
                ? onUnLike({ threadId: threadData.id })
                : onLike({ threadId: threadData.id })
            }
          >
            <Image
              src={threadData.isLiked ? likeLogo : likeLogoOutline}
              width={'27px'}
            />
            <Text>{threadData.likesCount}</Text>
          </Button>

          <Button variant={'ghost'} display={'flex'} gap={'4px'}>
            <Image src={replyLogoOutline} width={'27px'} />
            <Text>{threadData.repliesCount}</Text>
            <Text cursor={'pointer'} onClick={onClickCard}>
              Replies
            </Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
