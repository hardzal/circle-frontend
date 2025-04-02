import { Thread } from '@/features/thread/types/thread';
import { Avatar } from '@/components/ui/avatar';
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Grid,
  GridItem,
  Image,
  Portal,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LikeResponse } from '@/features/like/dto/like';
import {
  CreateLikeSchemaDTO,
  DeleteLikeSchemaDTO,
} from '@/utils/schemas/like.schema';
import { api } from '@/libs/api';
import { isAxiosError } from 'axios';
import { toaster } from '@/components/ui/toaster';
import { likeLogo, likeLogoOutline, replyLogoOutline } from '@/assets/icons';
import { Reply } from '@/features/reply/types/reply';
import CreateReply from '@/features/home/components/create-reply';
import CardReply from '@/features/home/components/card-reply';

export default function ProfileImage(thread: Thread) {
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
        queryKey: [`threads/${thread.id}`],
      });

      await queryClient.invalidateQueries({
        queryKey: [`threadImages`],
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
        queryKey: [`threads/${thread.id}`],
      });

      await queryClient.invalidateQueries({
        queryKey: [`threadImages`],
      });
    },
  });

  async function onLike(data: CreateLikeSchemaDTO) {
    await mutateLike(data);
  }

  async function onUnlike(data: DeleteLikeSchemaDTO) {
    await mutateUnlike(data);
  }

  const { data: replyData, isLoading: isLoadingReply } = useQuery<Reply[]>({
    queryKey: [`replyDataImages`],
    queryFn: async () => {
      const response = await api.get(`/replies/${thread.id}`);

      return response.data;
    },
  });

  return (
    <>
      <Dialog.Root size="full" motionPreset="slide-in-bottom">
        <Dialog.Trigger asChild>
          <Button variant="outline" size="xl" width={'100%'} height={'100%'}>
            <Image
              src={thread.images}
              alt={`Gallery ${thread.id}`}
              objectFit="cover"
              width="100%"
            />
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              {/* <Dialog.Header>
                <Dialog.Title>Dialog Title</Dialog.Title>
              </Dialog.Header> */}
              <Dialog.Body>
                <Grid templateColumns="repeat(4, 1fr)" gap="6">
                  <GridItem colSpan={3}>
                    <Box
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      padding={'5px'}
                    >
                      <Image
                        src={thread.images}
                        width={'100%'}
                        height={'100%'}
                        position={'relative'}
                        top={'75px'}
                        title={thread.content}
                      />
                    </Box>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <Box
                      display={'flex'}
                      gap={'4px'}
                      paddingTop={'30px'}
                      paddingBottom={'30px'}
                    >
                      <Avatar
                        name={thread.user?.profile?.fullName || ''}
                        src={thread.user?.profile?.avatar || ''}
                        shape="full"
                        size="full"
                        width={'50px'}
                        height={'50px'}
                      />
                      <Box marginLeft={'10px'}>
                        <Text fontWeight={'bold'}>
                          {thread.user?.profile?.fullName}
                        </Text>
                        <Text color={'secondary'}>
                          @{thread.user?.username}
                        </Text>
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection={'column'}>
                      <Text>{thread.content}</Text>
                      <Text color={'secondary'} marginTop={'15px'}>
                        {formatDistanceToNowStrict(
                          new Date(thread.createdAt).getTime(),
                          {
                            addSuffix: true,
                          }
                        )}
                      </Text>
                      <Box display={'flex'} marginTop="5px">
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
                      <CreateReply thread={thread.id as string} />
                      {thread.replies?.length ? (
                        isLoadingReply ? (
                          <Spinner />
                        ) : (
                          replyData?.map((reply) => <CardReply {...reply} />)
                        )
                      ) : (
                        <p>No one reply yet</p>
                      )}
                    </Box>
                  </GridItem>
                </Grid>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
