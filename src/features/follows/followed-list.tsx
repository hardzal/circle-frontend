import { Box, Button, Card, Heading, Spinner, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/libs/api';
import { useAuthStore } from '@/stores/auth';
import { FollowedEntity } from '@/entities/followed.entity';
import { toaster } from '@/components/ui/toaster';
import { isAxiosError } from 'axios';
import { FollowResponse } from './dto/follow';
import {
  CreateFollowSchemaDTO,
  DeleteFollowSchemaDTO,
} from '@/utils/schemas/follow.schema';

interface FollowData {
  title: string;
  key: string;
}

export default function FollowedList({ title }: FollowData) {
  const {
    profile: { userId },
  } = useAuthStore((state) => state.user);

  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
    failureReason,
  } = useQuery<FollowedEntity[]>({
    queryKey: ['followers'],
    queryFn: async () => {
      const response = await api.get(`/follows/${userId}/followers`);
      console.log('followers data', response.data);
      return response.data.data;
    },
  });

  const { isPending: isPendingFollow, mutateAsync: mutateFollow } = useMutation<
    FollowResponse,
    Error,
    CreateFollowSchemaDTO
  >({
    mutationKey: ['follow'],
    mutationFn: async (data: CreateFollowSchemaDTO) => {
      const response = await api.post<FollowResponse>(
        `/follows/${userId}`,
        data
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
        queryKey: ['followers'],
      });
    },
  });

  const { isPending: isPendingUnfollow, mutateAsync: mutateUnfollow } =
    useMutation<FollowResponse, Error, DeleteFollowSchemaDTO>({
      mutationKey: ['unfollow'],
      mutationFn: async (data: DeleteFollowSchemaDTO) => {
        const response = await api.delete<FollowResponse>(
          `/follows/${data.followedId}`
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
          queryKey: ['search-users'],
        });
      },
    });

  async function onFollow(data: CreateFollowSchemaDTO) {
    await mutateFollow(data);
  }

  async function onUnfollow(data: DeleteFollowSchemaDTO) {
    await mutateUnfollow(data);
  }

  return (
    <Card.Root size="sm" backgroundColor={'background'}>
      <Card.Header marginBottom={'10px'}>
        <Heading size="2xl">{title}</Heading>
      </Card.Header>
      <Card.Body>
        {isError && <Text color={'red'}>{failureReason?.message}</Text>}

        {isLoading ? (
          <Box display={'flex'} justifyContent={'center'} padding={'16px'}>
            <Spinner />
          </Box>
        ) : (
          <>
            {Array.isArray(users) ? (
              users?.map((searchUserData, index) => (
                <Box
                  display={'flex'}
                  gap={'20px'}
                  alignItems={'center'}
                  marginBottom={'20px'}
                  key={index}
                >
                  <Avatar
                    name={searchUserData.following?.profile?.fullName || ''}
                    src={searchUserData.following?.profile?.avatar || ''}
                    shape="full"
                    size="lg"
                  />
                  <Box display={'flex'} flexDirection={'column'} flex={'2'}>
                    <Text>{searchUserData.following?.profile?.fullName}</Text>
                    <Text color={'secondary'}>
                      @{searchUserData.following?.username}
                    </Text>
                  </Box>
                  <Button
                    variant={'outline'}
                    flex={'1'}
                    border={'1px solid white'}
                    borderRadius={'30px'}
                    disabled={isPendingFollow || isPendingUnfollow}
                    onClick={() =>
                      searchUserData?.isFollowing
                        ? onUnfollow({ followedId: searchUserData.id })
                        : onFollow({ followedId: searchUserData.id })
                    }
                  >
                    {searchUserData?.isFollowing ? 'Following' : 'Follow back'}
                  </Button>
                </Box>
              ))
            ) : (
              <p>Belum ada data yang bisa direkomendasikan</p>
            )}
          </>
        )}
      </Card.Body>
    </Card.Root>
  );
}
