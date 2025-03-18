import { Box, Card, Heading, Spinner, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/api';
import { useAuthStore } from '@/stores/auth';
import { FollowingEntity } from '@/entities/following.entity';
import ButtonFollow from './components/button-follow';

interface FollowData {
  title: string;
  key: string;
}

export default function FollowingList({ title }: FollowData) {
  const {
    profile: { userId },
  } = useAuthStore((state) => state.user);

  const {
    data: users,
    isLoading,
    isError,
    failureReason,
  } = useQuery<FollowingEntity[]>({
    queryKey: ['followings'],
    queryFn: async () => {
      const response = await api.get(`/follows/${userId}/followings`);
      console.log('followings data', response.data.data);
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
                    name={searchUserData.followed?.profile?.fullName || ''}
                    src={searchUserData.followed?.profile?.avatar || ''}
                    shape="full"
                    size="lg"
                  />
                  <Box display={'flex'} flexDirection={'column'} flex={'2'}>
                    <Text>
                      {searchUserData.followed?.profile?.fullName}
                      <Text
                        fontSize={'smaller'}
                        display={'inline'}
                        bgColor={'secondary'}
                        marginLeft={'2'}
                        color={'primary'}
                      >
                        <em>
                          {' '}
                          {searchUserData.isFollowed === true
                            ? 'Follows you'
                            : null}
                        </em>
                      </Text>
                    </Text>
                    <Text color={'secondary'}>
                      @{searchUserData.followed?.username}
                    </Text>
                  </Box>
                  <ButtonFollow
                    userId={userId}
                    searchUserData={searchUserData}
                  />
                </Box>
              ))
            ) : (
              <p>Belum ada user yang follow</p>
            )}
          </>
        )}
      </Card.Body>
    </Card.Root>
  );
}
