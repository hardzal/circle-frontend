import { likeLogo, likeLogoOutline, replyLogoOutline } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import {
  Box,
  Button,
  Editable,
  Field,
  IconButton,
  Image,
  Menu,
  Portal,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

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
import { LuCheck, LuEllipsis, LuPencilLine, LuX } from 'react-icons/lu';

import { formatDistanceStrict } from 'date-fns';
import { useAuthStore } from '@/stores/auth';
import { ThreadResponse } from '@/features/thread/dto/thread';
import {
  DeleteThreadSchemaDTO,
  updateThreadSchema,
  UpdateThreadSchemaDTO,
} from '@/utils/schemas/thread.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
export default function CardThread(thread: Thread) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { profile } = useAuthStore((state) => state.user);

  function onClickCard() {
    navigate(`/thread/${thread.id}`);
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

  const { isPending: isPendingDelete, mutateAsync: mutateDeleteThread } =
    useMutation<ThreadResponse, Error, DeleteThreadSchemaDTO>({
      mutationKey: ['delete-thread'],
      mutationFn: async (data: DeleteThreadSchemaDTO) => {
        const response = await api.delete<ThreadResponse>(
          `/threads/${data.id}`
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

      onSuccess: async (data) => {
        await queryClient.invalidateQueries({
          queryKey: ['threads'],
        });

        toaster.create({
          title: data.message,
          type: 'success',
        });
      },
    });

  async function onDeleteThread(data: DeleteThreadSchemaDTO) {
    await mutateDeleteThread(data);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UpdateThreadSchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(updateThreadSchema),
    defaultValues: { content: thread.content },
  });

  const { isPending: isPendingEdit, mutateAsync: mutateEditThread } =
    useMutation<ThreadResponse, Error, UpdateThreadSchemaDTO>({
      mutationKey: ['update-thread'],
      mutationFn: async (data: UpdateThreadSchemaDTO) => {
        console.log('data:', data);
        const formData = new FormData();
        formData.append('content', data.content);

        if (data.images !== undefined && data?.images.length > 0) {
          formData.append('images', data?.images[0]);
        }

        const response = await api.put<ThreadResponse>(
          `/threads/${thread.id}`,
          formData
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

      onSuccess: async (data) => {
        console.log(data);
        await queryClient.invalidateQueries({
          queryKey: ['threads'],
        });

        toaster.create({
          title: data.message,
          type: 'success',
        });
      },
    });

  async function onSubmitUpdateThread(data: UpdateThreadSchemaDTO) {
    console.log(data);
    await mutateEditThread(data);
  }

  const content = watch('content');
  return (
    <Box
      display={'flex'}
      gap={'16px'}
      borderBottom={'1px solid'}
      borderColor={'outline'}
      padding={'16px'}
    >
      <Avatar
        name={thread.user?.profile?.fullName}
        src={thread.user?.profile?.avatar}
        shape="full"
        size="full"
        width={'50px'}
        height={'50px'}
      />

      <Box
        display={'flex'}
        flexDirection={'column'}
        alignContent={'center'}
        justifyContent={'space-around'}
        gap={'5px'}
      >
        <Box display={'flex'} gap={'10px'} justifyContent={'start-end'}>
          <Text fontWeight={'bold'}>{thread.user?.profile?.fullName}</Text>
          <Text color={'secondary'}>@{thread.user?.username}</Text>
          <Text color={'secondary'}>•</Text>
          <Text color={'secondary'}>
            {' '}
            {formatDistanceStrict(
              new Date(thread.createdAt).getTime(),
              new Date().getTime(),
              { addSuffix: true }
            )}
          </Text>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button size="sm" variant="ghost">
                <LuEllipsis />
              </Button>
            </Menu.Trigger>

            {isPendingDelete ? (
              <Spinner />
            ) : (
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    {profile.userId === thread?.user?.id && (
                      <Menu.Item
                        value={'delete'}
                        cursor={'pointer'}
                        onClick={() => onDeleteThread({ id: thread.id })}
                      >
                        Delete
                      </Menu.Item>
                    )}
                    <Menu.Item key={`/thread/hide`} value={'hide'} asChild>
                      <a href={'#'}>Hide</a>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            )}
          </Menu.Root>
        </Box>
        <form onSubmit={handleSubmit(onSubmitUpdateThread)}>
          <Editable.Root
            defaultValue={content}
            fontSize={'16px'}
            w="3xl"
            key={thread.id}
            disabled={!(profile.userId === thread.user?.id)}
            onSubmit={(newValue) => {
              console.log('content:', newValue);
              setValue(
                'content',
                newValue.currentTarget.textContent || content
              );
            }}
          >
            <Editable.Preview w="3xl" />
            <Field.Root invalid={!!errors.content?.message}>
              <Editable.Textarea
                w="3xl"
                height={'100px'}
                {...register('content')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    e.currentTarget.blur(); // This will trigger onSubmit
                  }
                }}
              />
              <Field.ErrorText>{errors.content?.message}</Field.ErrorText>
            </Field.Root>
            {profile.userId === thread.user?.id && isPendingEdit ? (
              <Spinner />
            ) : (
              <Editable.Control>
                <Editable.EditTrigger asChild>
                  <IconButton variant="ghost" size="xs">
                    <LuPencilLine />
                  </IconButton>
                </Editable.EditTrigger>
                <Editable.CancelTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuX />
                  </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                  <IconButton
                    variant="outline"
                    size="xs"
                    onClick={(e) => {
                      e.currentTarget?.blur();
                      handleSubmit(onSubmitUpdateThread)();
                    }}
                  >
                    <LuCheck />
                  </IconButton>
                </Editable.SubmitTrigger>
              </Editable.Control>
            )}
          </Editable.Root>
        </form>

        {thread.images && (
          <Image
            objectFit={'contain'}
            maxHeight={'300px'}
            maxWidth={'300px'}
            src={thread.images || ''}
          />
        )}
        <Box display={'flex'}>
          <Button
            variant={'ghost'}
            display={'flex'}
            gap={'4px'}
            disabled={isPendingLike || isPendingUnlike}
            onClick={() =>
              thread.isLiked
                ? onUnLike({ threadId: thread.id })
                : onLike({ threadId: thread.id })
            }
          >
            <Image
              src={thread.isLiked ? likeLogo : likeLogoOutline}
              width={'27px'}
            />
            <Text>{thread.likesCount}</Text>
          </Button>

          <Button variant={'ghost'} display={'flex'} gap={'4px'}>
            <Image src={replyLogoOutline} width={'27px'} />
            <Text>{thread.repliesCount}</Text>
            <Text cursor={'pointer'} onClick={onClickCard}>
              Replies
            </Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
