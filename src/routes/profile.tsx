import CardThread from '@/features/home/components/card-thread';
import { useAuthStore } from '@/stores/auth';
import { postDatas } from '@/utils/fake-datas/posts';
import { Box, Button, Image, Text } from '@chakra-ui/react';

export default function ProfilePage() {
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
    <>
      <Box display={'flex'} flexDirection={'column'} padding={'30px'}>
        <Text as={'h1'} fontSize={'2xl'} marginBottom={'5px'}>
          {fullName}
        </Text>
        <Box display={'flex'} flexDirection={'column'}>
          <Box
            backgroundImage={`url("${backgroundUrl}")`}
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
              src={avatarUrl}
              boxSize="100px"
              borderRadius="full"
              backgroundColor={'background'}
              border={'1px solid background'}
              fit="cover"
              marginLeft={'15px'}
              alt={fullName}
            />

            <Button
              position={'relative'}
              top={'10px'}
              backgroundColor={'background'}
              color={'white'}
              border={'1px solid white'}
              borderRadius={'30px'}
            >
              Edit Profile
            </Button>
          </Box>

          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={'5px'}
            position={'relative'}
            bottom={'20px'}
          >
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
        {postDatas.map((postData) => (
          <CardThread postData={postData} key={postData.id} />
        ))}
      </Box>
    </>
  );
}
