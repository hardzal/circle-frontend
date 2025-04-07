import CardThread from '@/features/home/components/card-thread';
import CreateThread from '@/features/home/components/create-thread';
import ProfileEdit from '@/features/profile/components/profile-edit';
import ProfileImage from '@/features/profile/components/profile-image';
import { Thread } from '@/features/thread/types/thread';
import { api } from '@/libs/api';
import { useAuthStore } from '@/stores/auth';
import {
  Box,
  Text,
  Image,
  Spinner,
  Tabs,
  Link as ChakraLink,
  Grid,
} from '@chakra-ui/react';
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
    password,
    profile: { id, fullName, bio, bannerURL, avatar, userId },
  } = useAuthStore((state) => state.user);

  const profileData = {
    id,
    username,
    email,
    password,
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

  const {
    data: threadImages,
    isLoading: isLoadingImages,
    isError: isErrorImages,
    failureReason: failureReasonImages,
  } = useQuery<Thread[]>({
    queryKey: ['threadImages'],
    queryFn: async () => {
      const response = await api.get(`/threads/${userId}/images`);

      return response.data.data;
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
            backgroundImage={`url("${profileData.bannerURL || 'https://api.dicebear.com/9.x/glass/svg?seed=' + username}")`}
            padding={'15px'}
            borderRadius={'lg'}
            height={'140px'}
            position={'relative'}
            backgroundSize={'cover'}
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

      <Tabs.Root defaultValue="posts">
        <Tabs.List display={'flex'} justifyContent={'space-around'}>
          <Tabs.Trigger value="posts" asChild borderBottomColor={'green'}>
            <ChakraLink unstyled href="#posts">
              <Text>All Post</Text>
            </ChakraLink>
          </Tabs.Trigger>
          <Tabs.Trigger value="medias" asChild>
            <ChakraLink unstyled href="#medias">
              <Text>Media</Text>
            </ChakraLink>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="posts">
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
        </Tabs.Content>
        <Tabs.Content value="medias">
          {/* <Text>Media Profile here</Text> */}
          {isErrorImages && (
            <Text color={'red'}>{failureReasonImages?.message}</Text>
          )}
          {isLoadingImages ? (
            <Box display={'flex'} justifyContent={'center'} padding={'50px'}>
              <Spinner />
            </Box>
          ) : (
            <Grid
              templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
              gap={4}
              p={4}
            >
              {threadImages
                ?.filter((data) => data !== undefined && data.images !== null)
                .map((thread, index) => (
                  <Box
                    key={index}
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="md"
                    _hover={{ transform: 'scale(1.05)', transition: '0.3s' }}
                  >
                    {/* <Image
                      src={thread.images}
                      alt={`Gallery ${index}`}
                      objectFit="cover"
                      width="100%"
                    /> */}
                    <ProfileImage {...thread} />
                  </Box>
                ))}
            </Grid>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
