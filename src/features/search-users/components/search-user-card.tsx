import { Avatar } from '@/components/ui/avatar';
import { Box, BoxProps, Button, Text } from '@chakra-ui/react';
import { useReducer } from 'react';
import { SearchUser } from '../types/search-user';

interface SearchUserCardProps extends BoxProps {
  searchUserData: SearchUser;
}

export default function SearchUserCard({
  searchUserData,
  ...props
}: SearchUserCardProps) {
  const [, forceUpdate] = useReducer((state) => state + 1, 0);

  return (
    <Box
      display={'flex'}
      gap={'16px'}
      borderBottom={'1px solid'}
      borderColor={'outline'}
      padding={'16px 0px'}
      {...props}
    >
      <Avatar
        name={searchUserData.fullName}
        src={searchUserData.avatarUrl}
        shape="full"
        size="full"
        width={'50px'}
        height={'50px'}
      />

      <Box display={'flex'} flexDirection={'column'} gap={'4px'} flex={'10'}>
        <Text fontWeight={'bold'}>{searchUserData.fullName}</Text>
        <Text color={'secondary'}>@{searchUserData.username}</Text>
        <Text>{searchUserData.bio}</Text>
      </Box>
      <Button
        variant={'outline'}
        flex={'1'}
        onClick={() => {
          searchUserData.isFollowed = !searchUserData.isFollowed;
          forceUpdate();
        }}
      >
        {searchUserData.isFollowed ? 'Unfollow' : 'Follow'}
      </Button>
    </Box>
  );
}
