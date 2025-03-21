import { Box, Card, Heading, Spinner, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/api';
import ButtonFollow from '@/features/follows/components/button-follow';
import { FollowToggleEntity } from '@/entities/followtoggle.entity';
import { useAuthStore } from '@/stores/auth';

export default function FollowsSidebar({ background = 'background' }) {
  const {
    profile: { userId },
  } = useAuthStore((state) => state.user);

  const {
    data: users,
    isLoading,
    isError,
    failureReason,
  } = useQuery<FollowToggleEntity[]>({
    queryKey: ['userSuggest'],
    queryFn: async () => {
      const response = await api.get(`/follows/suggest`);

      return response.data.data;
    },
  });

  return (
    <Card.Root size="sm" backgroundColor={background}>
      <Card.Header marginBottom={'10px'}>
        <Heading size="2xl">Suggested for you</Heading>
      </Card.Header>
      <Card.Body>
        {isError && <Text color={'red'}>{failureReason?.message}</Text>}

        {isLoading ? (
          <Box display={'flex'} justifyContent={'center'} padding={'16px'}>
            <Spinner />
          </Box>
        ) : (
          <>
            {users?.map((searchUserData, index) => (
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
                <ButtonFollow
                  userId={userId}
                  searchUserData={searchUserData}
                  key={userId}
                />
              </Box>
            ))}
          </>
        )}
      </Card.Body>
    </Card.Root>
  );
}
