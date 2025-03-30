import CardThread from '@/features/home/components/card-thread';
import { Thread } from '@/features/thread/types/thread';
import { api } from '@/libs/api';
import { Box, Text, Image, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { UserProfile } from '../types/user';
import React, { useEffect } from 'react';
import { FollowToggleEntity } from '@/entities/followtoggle.entity';
import ButtonUnfollow from '@/features/follows/components/button-unfollow';
import ButtonFollow from '@/features/follows/components/button-follow';

interface followInfo {
  followerCount: number;
  followingCount: number;
}

export default function ProfileUserPage() {
  const { username } = useParams();

  const { data: user, isFetching: isFetchingUser } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await api.get(`/users/${username}`);

      return response.data.data;
    },
  });

  const userId = user?.profile?.userId;

  const {
    data: threads,
    isFetching: isFetchingThreads,
    refetch: refetchThreads,
    isError,
    failureReason,
  } = useQuery<Thread[]>({
    queryKey: ['profileThreads', userId],
    queryFn: async () => {
      const response = await api.get(`/threads/${userId}/user`);

      return response.data;
    },
    enabled: !!userId,
  });

  const {
    data,
    isFetching: isFetchingFollow,
    refetch: refetchFollow,
  } = useQuery<followInfo>({
    queryKey: ['userFollowCount', userId],
    queryFn: async () => {
      const response = await api.get(`/follows/${userId}/count`);

      return response.data.data;
    },
    enabled: !!userId,
  });

  const {
    data: userFollow,
    isFetching: isFetchFollowProfile,
    refetch: refetchFollowProfile,
  } = useQuery<FollowToggleEntity>({
    queryKey: ['followings'],
    queryFn: async () => {
      const response = await api.get(`/follows/${userId}/follow`);

      return response.data.data;
    },
  });

  useEffect(() => {
    if (userId) {
      refetchFollow();
      refetchThreads();
      refetchFollowProfile();
    }
  }, [userId, refetchFollow, refetchThreads, refetchFollowProfile]);

  const buttonStyling: React.CSSProperties = {
    position: 'relative',
    top: '10px',
    color: 'white',
    border: '1px solid white',
    borderRadius: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    minWidth: '150px',
  };

  return (
    <>
      {isFetchingUser && isFetchingFollow ? (
        <Spinner />
      ) : (
        <Box display={'flex'} flexDirection={'column'} padding={'30px'}>
          <Text as={'h1'} fontSize={'2xl'} marginBottom={'5px'}>
            {user?.profile?.fullName}
          </Text>
          <Box display={'flex'} flexDirection={'column'}>
            <Box
              backgroundImage={`url("${user?.profile?.bannerURL || 'https://api.dicebear.com/9.x/glass/svg?seed=' + username}}")`}
              padding={'15px'}
              borderRadius={'lg'}
              height={'140px'}
              position={'relative'}
              zIndex={'1'}
            ></Box>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              zIndex={'10'}
              position={'relative'}
              bottom={'35px'}
              marginBottom={'0px'}
              width={'100%'}
            >
              <Image
                position={'relative'}
                left={'15px'}
                bottom={'10px'}
                src={`${
                  user?.profile?.avatar ||
                  `https://api.dicebear.com/9.x/notionists/svg?seed=${user?.profile?.fullName}`
                }`}
                boxSize="100px"
                borderRadius="full"
                backgroundColor={'background'}
                border={'1px solid background'}
                fit="cover"
                marginLeft={'15px'}
                alt={`${user?.profile?.fullName}`}
              />

              {isFetchFollowProfile ? (
                <Spinner />
              ) : userFollow?.isFollowing ? (
                <ButtonUnfollow
                  userId={userId as string}
                  searchUserData={userFollow}
                  key={userId}
                  buttonStyle={buttonStyling}
                />
              ) : (
                <ButtonFollow
                  userId={userId as string}
                  searchUserData={userFollow as FollowToggleEntity}
                  key={userId}
                  buttonStyle={buttonStyling}
                />
              )}
            </Box>

            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={'5px'}
              position={'relative'}
              bottom={'20px'}
            >
              <Text>{`${user?.profile?.fullName}`}</Text>
              <Text color={'secondary'}>@{`${username}`}</Text>
              <Text>{user?.profile?.bio}</Text>
              <Box display={'flex'} gap={'5px'}>
                <Box display={'flex'} gap={'5px'} marginRight={'5px'}>
                  <Text fontWeight={'bold'}>{data?.followingCount}</Text>
                  <Link to={`/follows/${username}#followings`}>
                    <Text color={'secondary'}>Following</Text>
                  </Link>
                </Box>
                <Box display={'flex'} gap={'5px'}>
                  <Text fontWeight={'bold'}>{data?.followerCount}</Text>
                  <Link to={`/follows/${username}#followers`}>
                    <Text color={'secondary'}>Followers</Text>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <Box display={'flex'} justifyContent={'space-around'}>
        <Text>All Post</Text>
        <Text>Media</Text>
      </Box>
      <Box display={'flex'} height={'5px'}>
        <hr style={{ backgroundColor: 'green', height: '5px', width: '50%' }} />
        <hr />
      </Box>
      <hr />
      <Box display={'flex'} flexDirection={'column'} gap={'16px'}>
        {isError && <Text color={'red'}>{failureReason?.message}</Text>}
        {isFetchingThreads ? (
          <Box display={'flex'} justifyContent={'center'} padding={'50px'}>
            <Spinner />
          </Box>
        ) : (
          <Box display={'flex'} flexDirection={'column'} gap={'16px'}>
            {threads?.map((thread: Thread) => (
              <CardThread {...thread} key={thread.id} />
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
