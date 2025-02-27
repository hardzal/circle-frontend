import { Box, Button, Card, Heading, Text, Image } from '@chakra-ui/react';

interface UserProfile {
  username: string;
  profile: {
    fullName: string;
    avatar?: string;
    banerURL?: string;
    bio?: string;
  };
}

export default function ProfileSidebar({ username, profile }: UserProfile) {
  return (
    <>
      <Card.Root size="sm" backgroundColor={'background'} marginBottom={'20px'}>
        <Card.Header>
          <Heading size="2xl">My Profile</Heading>
        </Card.Header>
        <Card.Body>
          <Box
            backgroundImage={`url("${profile.banerURL || 'https://api.dicebear.com/9.x/glass/svg?seed=' + username}  ")`}
            padding={'15px'}
            borderRadius={'lg'}
            height={'100px'}
            position={'relative'}
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

            <Button
              backgroundColor={'background'}
              color={'white'}
              border={'1px solid white'}
              borderRadius={'30px'}
            >
              Edit Profile
            </Button>
          </Box>

          <Box display={'flex'} flexDirection={'column'} gap={'5px'}>
            <Text>{profile.fullName}</Text>
            <Text color={'secondary'}>@{username}</Text>
            <Text>{profile.bio}</Text>
            <Box display={'flex'} gap={'5px'}>
              <Box display={'flex'} gap={'5px'} marginRight={'5px'}>
                <Text fontWeight={'bold'}>{200}</Text>
                <Text color={'secondary'}>Following</Text>
              </Box>
              <Box display={'flex'} gap={'5px'}>
                <Text fontWeight={'bold'}>{200}</Text>
                <Text color={'secondary'}>Followers</Text>
              </Box>
            </Box>
          </Box>
        </Card.Body>
      </Card.Root>
    </>
  );
}
