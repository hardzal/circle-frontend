import { Box, Card, Heading, Text, Image } from '@chakra-ui/react';
import { api } from '@/libs/api';
import { useQuery } from '@tanstack/react-query';
import ProfileEdit from '@/features/profile/components/profile-edit';

interface UserProfile {
  email: string;
  username: string;
  password: string;
  profile: {
    id: string;
    userId: string;
    fullName: string;
    avatar?: string;
    bannerURL?: string;
    bio?: string;
  };
}
interface followInfo {
  followerCount: number;
  followingCount: number;
}

export default function ProfileSidebar({
  email,
  username,
  password,
  profile,
}: UserProfile) {
  const { data } = useQuery<followInfo>({
    queryKey: ['followCount'],
    queryFn: async () => {
      const response = await api.get(`/follows/${profile.userId}/count`);

      return response.data.data;
    },
  });

  const profileEdit = { ...profile, username, email, password };

  return (
    <>
      <Card.Root size="sm" backgroundColor={'background'} marginBottom={'20px'}>
        <Card.Header>
          <Heading size="2xl">My Profile</Heading>
        </Card.Header>
        <Card.Body>
          <Box
            backgroundImage={`url("${profile.bannerURL || 'https://api.dicebear.com/9.x/glass/svg?seed=' + username}  ")`}
            padding={'15px'}
            borderRadius={'lg'}
            height={'100px'}
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
            bottom={'30px'}
          >
            <Image
              src={
                profile.avatar ||
                `https://api.dicebear.com/9.x/notionists/svg?seed=${profile.fullName}`
              }
              boxSize="80px"
              borderRadius="full"
              backgroundColor={'background'}
              border={'1px solid background'}
              fit="cover"
              marginLeft={'15px'}
              alt={profile.fullName}
            />

            <ProfileEdit {...profileEdit} />
          </Box>

          <Box display={'flex'} flexDirection={'column'} gap={'5px'}>
            <Text>{profile.fullName}</Text>
            <Text color={'secondary'}>@{username}</Text>
            <Text>{profile.bio}</Text>
            <Box display={'flex'} gap={'5px'}>
              <Box display={'flex'} gap={'5px'} marginRight={'5px'}>
                <Text fontWeight={'bold'}>{data?.followingCount}</Text>
                <Text color={'secondary'}>Following</Text>
              </Box>
              <Box display={'flex'} gap={'5px'}>
                <Text fontWeight={'bold'}>{data?.followerCount}</Text>
                <Text color={'secondary'}>Followers</Text>
              </Box>
            </Box>
          </Box>
        </Card.Body>
      </Card.Root>
    </>
  );
}
