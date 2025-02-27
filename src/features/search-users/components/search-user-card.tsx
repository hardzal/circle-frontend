import { Avatar } from '@/components/ui/avatar';
import { Box, BoxProps, Button, Text } from '@chakra-ui/react';
import { SearchUser } from '../types/search-user';

interface SearchUserCardProps extends BoxProps {
  searchUserData: SearchUser;
}

export default function SearchUserCard({
  searchUserData,
  ...props
}: SearchUserCardProps) {
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
        name={
          searchUserData.profile.fullName ||
          `https://api.dicebear.com/9.x/notionists/svg?seed=${searchUserData.profile.fullName}`
        }
        src={
          searchUserData.profile.avatar ||
          'https://api.dicebear.com/9.x/glass/svg?seed=' +
            searchUserData.username
        }
        shape="full"
        size="full"
        width={'50px'}
        height={'50px'}
      />

      <Box display={'flex'} flexDirection={'column'} gap={'4px'} flex={'10'}>
        <Text fontWeight={'bold'}>{searchUserData.profile.fullName}</Text>
        <Text color={'secondary'}>@{searchUserData.username}</Text>
        <Text>{searchUserData.profile.bio}</Text>
      </Box>
      <Button
        variant={'outline'}
        flex={'1'}
        onClick={() => {
          // searchUserData.isFollowed = !searchUserData.isFollowed;
          // forceUpdate();
        }}
      >
        {/* {searchUserData.isFollowed ? 'Unfollow' : 'Follow'} */}
        Follow
      </Button>
    </Box>
  );
}
