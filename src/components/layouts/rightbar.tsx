import { useAuthStore } from '@/stores/auth';
// import { userSession } from '@/utils/fake-datas/session';
import {
  Box,
  BoxProps,
  Button,
  Card,
  Heading,
  Text,
  Image,
} from '@chakra-ui/react';

export default function RightBar(props: BoxProps) {
  const {
    fullName,
    avatarUrl,
    backgroundUrl,
    followersCount,
    followingsCount,
    username,
    bio,
  } = useAuthStore((state) => state.user);

  return (
    <Box height={'100vh'} padding={'40px'} {...props}>
      <Card.Root size="sm" backgroundColor={'background'}>
        <Card.Header>
          <Heading size="2xl">My Profile</Heading>
        </Card.Header>
        <Card.Body>
          <Box
            backgroundImage={`url("${backgroundUrl}")`}
            padding={'15px'}
            borderRadius={'lg'}
            height={'100px'}
            position={'relative'}
            zIndex={'1'}
          ></Box>

          <Box
            display={'flex'}
            gap={'150px'}
            alignContent={'space-between'}
            alignItems={'center'}
            zIndex={'10'}
            position={'relative'}
            bottom={'30px'}
          >
            <Image
              src={avatarUrl}
              boxSize="80px"
              borderRadius="full"
              backgroundColor={'background'}
              border={'1px solid background'}
              fit="cover"
              marginLeft={'15px'}
              alt={fullName}
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
            <Text>{fullName}</Text>
            <Text color={'secondary'}>@{username}</Text>
            <Text>{bio}</Text>
            <Box display={'flex'} gap={'5px'}>
              <Box display={'flex'} gap={'5px'} marginRight={'5px'}>
                <Text fontWeight={'bold'}>{followingsCount}</Text>
                <Text color={'secondary'}>Following</Text>
              </Box>
              <Box display={'flex'} gap={'5px'}>
                <Text fontWeight={'bold'}>{followersCount}</Text>
                <Text color={'secondary'}>Followers</Text>
              </Box>
            </Box>
          </Box>
        </Card.Body>
      </Card.Root>

      <Card.Root size="sm" backgroundColor={'background'} marginTop={'20px'}>
        <Card.Header>
          <Heading size="2xl">Suggested for you</Heading>
        </Card.Header>
        <Card.Body></Card.Body>
      </Card.Root>
    </Box>
  );
}
