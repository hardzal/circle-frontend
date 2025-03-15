import { Box, Button, Card, Heading, Spinner, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '@/features/profile/types/user';
import { api } from '@/libs/api';

export default function FollowsSidebar({ background = 'background' }) {
  const {
    data: users,
    isLoading,
    isError,
    failureReason,
  } = useQuery<UserProfile[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get(`/users`);

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
                    name={searchUserData.profile?.fullName || ''}
                    src={searchUserData.profile?.avatar || ''}
                    shape="full"
                    size="lg"
                  />
                  <Box display={'flex'} flexDirection={'column'} flex={'2'}>
                    <Text>{searchUserData.profile?.fullName}</Text>
                    <Text color={'secondary'}>@{searchUserData.username}</Text>
                  </Box>
                  <Button
                    variant={'outline'}
                    flex={'1'}
                    border={'1px solid white'}
                    borderRadius={'30px'}
                    onClick={() => {}}
                  >
                    {/* {searchUserData.isFollowed ? 'Unfollow' : 'Follow'} */}
                    Follow
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
