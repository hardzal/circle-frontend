import { Box, Card, Heading, Spinner, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/api';
import { useAuthStore } from '@/stores/auth';
import ButtonUnfollow from './components/button-unfollow';
import ButtonFollow from './components/button-follow';
import { FollowToggleEntity } from '@/entities/followtoggle.entity';

interface FollowData {
  title: string;
  key: string;
}

export default function FollowedList({ title }: FollowData) {
  const {
    profile: { userId },
  } = useAuthStore((state) => state.user);

  const {
    data: users,
    isLoading,
    isError,
    failureReason,
  } = useQuery<FollowToggleEntity[]>({
    queryKey: ['followers'],
    queryFn: async () => {
      const response = await api.get(`/follows/${userId}/followers`);
      console.log('followers data', response.data);
      return response.data.data;
    },
  });

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
                  {searchUserData?.isFollowing ? (
                    <ButtonUnfollow
                      userId={userId}
                      searchUserData={searchUserData}
                      key={userId}
                    />
                  ) : (
                    <ButtonFollow
                      userId={userId}
                      searchUserData={searchUserData}
                      key={userId}
                    />
                  )}
                </Box>
              ))
            ) : (
              <p>Belum ada data user follower.</p>
            )}
          </>
        )}
      </Card.Body>
    </Card.Root>
  );
}
