import { Box, Card, Heading, Spinner, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/libs/api';
import ButtonUnfollow from './components/button-unfollow';
import ButtonFollow from './components/button-follow';
import { FollowToggleEntity } from '@/entities/followtoggle.entity';
import { Link } from 'react-router-dom';
import { ProfileEntity } from '@/entities/profile.entity';

interface FollowData {
  title: string;
  key: string;
  profile: ProfileEntity;
}

export default function FollowedList({ title, profile }: FollowData) {
  const { userId } = profile;

  const {
    data: users,
    isLoading,
    isError,
    failureReason,
    // refetch: refetchFollowers,
  } = useQuery<FollowToggleEntity[]>({
    queryKey: ['followers', userId],
    enabled: !!userId,
    queryFn: async () => {
      const response = await api.get(`/follows/${userId}/followers`);

      return response.data.data;
    },
  });

  // useEffect(() => {
  //   if (userId) {
  //     refetchFollowers();
  //   }
  // }, [userId, refetchFollowers]);

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
                    <Link
                      to={`/profile/${searchUserData.following?.username}`}
                      className="link-profile"
                    >
                      <Text className="text-profile">
                        {searchUserData.following?.profile?.fullName}
                      </Text>
                    </Link>
                    <Text color={'secondary'} className="text-profile">
                      @{searchUserData.following?.username}
                    </Text>
                  </Box>
                  {searchUserData?.isFollowing ? (
                    <ButtonUnfollow
                      userId={userId}
                      searchUserData={searchUserData}
                      key={userId}
                      buttonStyle={{
                        flex: '1',
                      }}
                    />
                  ) : (
                    <ButtonFollow
                      userId={userId}
                      searchUserData={searchUserData}
                      key={userId}
                      buttonStyle={{
                        flex: '1',
                      }}
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
