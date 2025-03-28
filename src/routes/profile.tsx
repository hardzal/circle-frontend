import CardThread from '@/features/home/components/card-thread';
import CreateThread from '@/features/home/components/create-thread';
import ProfileEdit from '@/features/profile/components/profile-edit';
import { Thread } from '@/features/thread/types/thread';
import { api } from '@/libs/api';
import { useAuthStore } from '@/stores/auth';
import { Box, Text, Image, Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

interface followInfo {
  followerCount: number;
  followingCount: number;
}

export default function ProfilePage() {
  const {
    username,
    email,
    profile: { id, fullName, bio, bannerURL, avatar, userId },
  } = useAuthStore((state) => state.user);

  const profileData = {
    id,
    username,
    email,
    fullName,
    bio,
    bannerURL,
    avatar,
    userId,
  };

  const {
    data: threads,
    isLoading,
    isError,
    failureReason,
  } = useQuery<Thread[]>({
    queryKey: ['threads'],
    queryFn: async () => {
      const response = await api.get(`/threads/${userId}/user`);

      return response.data;
    },
  });

  const { data } = useQuery<followInfo>({
    queryKey: ['followCount'],
    queryFn: async () => {
      const response = await api.get(`/follows/${userId}/count`);

      return response.data.data;
    },
  });

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} padding={'30px'}>
        <Text as={'h1'} fontSize={'2xl'} marginBottom={'5px'}>
          {profileData.fullName}
        </Text>
        <Box display={'flex'} flexDirection={'column'}>
          <Box
            backgroundImage={`url("${profileData.bannerURL || 'https://api.dicebear.com/9.x/glass/svg?seed=' + username}}")`}
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
          >
            <Image
              position={'relative'}
              left={'15px'}
              bottom={'10px'}
              src={`${
                profileData.avatar ||
                `https://api.dicebear.com/9.x/notionists/svg?seed=${profileData.fullName}`
              }`}
              boxSize="100px"
              borderRadius="full"
              backgroundColor={'background'}
              border={'1px solid background'}
              fit="cover"
              marginLeft={'15px'}
              alt={`${fullName}`}
            />

            <ProfileEdit {...profileData} />
          </Box>

          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={'5px'}
            position={'relative'}
            bottom={'20px'}
          >
            <Text>{`${profileData.fullName}`}</Text>
            <Text color={'secondary'}>@{`${username}`}</Text>
            <Text>{bio}</Text>
            <Box display={'flex'} gap={'5px'}>
              <Box display={'flex'} gap={'5px'} marginRight={'5px'}>
                <Text fontWeight={'bold'}>{data?.followingCount}</Text>
                <Link to="/follows#followings">
                  <Text color={'secondary'}>Following</Text>
                </Link>
              </Box>
              <Box display={'flex'} gap={'5px'}>
                <Text fontWeight={'bold'}>{data?.followerCount}</Text>
                <Link to="/follows#followers">
                  <Text color={'secondary'}>Followers</Text>
                </Link>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
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
        <CreateThread />
        {isError && <Text color={'red'}>{failureReason?.message}</Text>}
        {isLoading ? (
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
