import { Avatar } from '@/components/ui/avatar';
import { Box, BoxProps, Button, Text } from '@chakra-ui/react';
import { SearchUser } from '../types/search-user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FollowResponse } from '@/features/follows/dto/follow';
import {
  CreateFollowSchemaDTO,
  DeleteFollowSchemaDTO,
} from '@/utils/schemas/follow.schema';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/libs/api';
import { isAxiosError } from 'axios';
import { toaster } from '@/components/ui/toaster';
import { Link } from 'react-router-dom';
interface SearchUserCardProps extends BoxProps {
  searchUserData: SearchUser;
}

export default function SearchUserCard({
  searchUserData,
  ...props
}: SearchUserCardProps) {
  const queryClient = useQueryClient();

  const {
    profile: { userId },
  } = useAuthStore((state) => state.user);

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
        queryKey: ['search-users'],
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
    <Box
      display={'flex'}
      gap={'16px'}
      borderBottom={'1px solid'}
      borderColor={'outline'}
      padding={'16px 0px'}
      {...props}
    >
      <Avatar
        name={
          searchUserData.profile.fullName ||
          `https://api.dicebear.com/9.x/notionists/svg?seed=${searchUserData.profile.fullName}`
        }
        src={
          searchUserData.profile.avatar ||
          'https://api.dicebear.com/9.x/glass/svg?seed=' +
            searchUserData.username
        }
        shape="full"
        size="full"
        width={'50px'}
        height={'50px'}
      />

      <Box display={'flex'} flexDirection={'column'} gap={'4px'} flex={'10'}>
        <Link to={`/profile/${searchUserData.username}`}>
          <Text fontWeight={'bold'}>{searchUserData.profile.fullName}</Text>
        </Link>
        <Link to={`/profile/${searchUserData.username}`}>
          <Text color={'secondary'}>@{searchUserData.username}</Text>
        </Link>
        <Text>{searchUserData.profile.bio}</Text>
      </Box>
      <Button
        variant={'outline'}
        flex={'1'}
        disabled={isPendingFollow || isPendingUnfollow}
        onClick={() =>
          searchUserData?.isFollowing
            ? onUnfollow({ followedId: searchUserData.id })
            : onFollow({ followedId: searchUserData.id })
        }
      >
        {searchUserData.isFollowing ? 'Following' : 'Follow'}
      </Button>
    </Box>
  );
}
