import { Box, Card, Heading, Spinner, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/api';
import ButtonUnfollow from './components/button-unfollow';
import { FollowToggleEntity } from '@/entities/followtoggle.entity';
import { Link } from 'react-router-dom';
import { ProfileEntity } from '@/entities/profile.entity';

interface FollowData {
  title: string;
  key: string;
  profile: ProfileEntity;
}

export default function FollowingList({ title, profile }: FollowData) {
  const { userId } = profile;

  const {
    data: users,
    isLoading,
    isError,
    failureReason,
  } = useQuery<FollowToggleEntity[]>({
    queryKey: ['followings', userId],
    enabled: !!userId,
    queryFn: async () => {
      const response = await api.get(`/follows/${userId}/followings`);

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
                    <Link to={`/profile/${searchUserData.followed?.username}`}>
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
                    </Link>
                    <Text color={'secondary'}>
                      @{searchUserData.followed?.username}
                    </Text>
                  </Box>
                  <ButtonUnfollow
                    userId={userId}
                    searchUserData={searchUserData}
                    buttonStyle={{
                      flex: '1',
                    }}
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
