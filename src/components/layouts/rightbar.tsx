import { useAuthStore } from '@/stores/auth';
import { Box, BoxProps } from '@chakra-ui/react';

import ProfileSidebar from './profile-sidebar';
import FollowsSidebar from './follows-sidebar';
import { useLocation } from 'react-router-dom';

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
  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <Box
      height={'100vh'}
      padding={'40px'}
      {...props}
      position={'fixed'}
      top={'0'}
      right={'0'}
    >
      {pathname !== '/profile' && (
        <ProfileSidebar
          fullName={fullName}
          username={username}
          followersCount={followersCount}
          followingsCount={followingsCount}
          backgroundUrl={backgroundUrl}
          avatarUrl={avatarUrl}
          bio={bio}
        />
      )}

      <FollowsSidebar />
    </Box>
  );
}
