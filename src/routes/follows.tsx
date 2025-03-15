import FollowedList from '@/features/follows/followed-list';
import FollowingList from '@/features/follows/following-list';
import { Box, Text } from '@chakra-ui/react';
import { Link, Tabs } from '@chakra-ui/react';

export default function FollowsPage() {
  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Text as={'h1'} fontSize={'2xl'} margin={'20px'}>
        Follows
      </Text>

      <Tabs.Root defaultValue="followers">
        <Tabs.List display={'flex'} justifyContent={'space-around'}>
          <Tabs.Trigger value="followers" asChild>
            <Link unstyled href="#followers">
              <Text>Followers</Text>
            </Link>
          </Tabs.Trigger>
          <Tabs.Trigger value="followings" asChild>
            <Link unstyled href="#followings">
              <Text>Following</Text>
            </Link>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="followers">
          <FollowedList key="1" title="Followers Data" />
        </Tabs.Content>
        <Tabs.Content value="followings">
          <FollowingList key="2" title="Followings data" />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
