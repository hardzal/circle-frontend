import { Box, Button, Card, Heading, Text } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import { searchUserDatas } from '@/utils/fake-datas/search-users';
import { useReducer } from 'react';

export default function FollowsSidebar() {
  const dataUser = searchUserDatas.slice(0, 5);

  const [, forceUpdate] = useReducer((state) => state + 1, 0);

  return (
    <Card.Root size="sm" backgroundColor={'background'} marginTop={'20px'}>
      <Card.Header marginBottom={'10px'}>
        <Heading size="2xl">Suggested for you</Heading>
      </Card.Header>
      <Card.Body>
        {dataUser.map((searchUserData, index) => (
          <Box
            display={'flex'}
            gap={'20px'}
            alignItems={'center'}
            marginBottom={'20px'}
            key={index}
          >
            <Avatar
              name={searchUserData.fullName}
              src={searchUserData.avatarUrl}
              shape="full"
              size="lg"
            />
            <Box display={'flex'} flexDirection={'column'} flex={'2'}>
              <Text>{searchUserData.fullName}</Text>
              <Text color={'secondary'}>@{searchUserData.username}</Text>
            </Box>
            <Button
              variant={'outline'}
              flex={'1'}
              border={'1px solid white'}
              borderRadius={'30px'}
              onClick={() => {
                searchUserData.isFollowed = !searchUserData.isFollowed;
                forceUpdate();
              }}
            >
              {searchUserData.isFollowed ? 'Unfollow' : 'Follow'}
            </Button>
          </Box>
        ))}
      </Card.Body>
    </Card.Root>
  );
}
