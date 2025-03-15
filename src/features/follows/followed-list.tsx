import { Box, Button, Card, Heading, Spinner, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/api';
import { useAuthStore } from '@/stores/auth';
import { FollowedEntity } from '@/entities/followed.entity';

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
  } = useQuery<FollowedEntity[]>({
    queryKey: ['followers'],
    queryFn: async () => {
      const response = await api.get(`/follows/${userId}/followers`);

      console.log(response.data);

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
                  <Button
                    variant={'outline'}
                    flex={'1'}
                    border={'1px solid white'}
                    borderRadius={'30px'}
                    onClick={() => {}}
                  >
                    {/* {searchUserData.isfollowing ? 'Unfollow' : 'Follow'} */}
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
