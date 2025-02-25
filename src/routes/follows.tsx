import FollowsSidebar from '@/components/layouts/follows-sidebar';
import { Box, Text } from '@chakra-ui/react';

export default function FollowsPage() {
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Text as={'h1'} fontSize={'2xl'} margin={'20px'}>
        Follows
      </Text>
      <Box display={'flex'} justifyContent={'space-around'}>
        <Text>Followers</Text>
        <Text>Following</Text>
      </Box>
      <Box display={'flex'} height={'5px'}>
        <hr style={{ backgroundColor: 'green', height: '5px', width: '50%' }} />
        <hr />
      </Box>
      <hr />

      <FollowsSidebar />
    </Box>
  );
}
