import { useAuthStore } from '@/stores/auth';
import { Box, BoxProps } from '@chakra-ui/react';

import ProfileSidebar from './profile-sidebar';
import FollowsSidebar from './follows-sidebar';
import { useLocation } from 'react-router-dom';
// import { profileLogo } from '@/assets/icons';

export default function RightBar(props: BoxProps) {
  const {
    username,
    profile: { fullName, bio, bannerUrl, avatarUrl },
  } = useAuthStore((state) => state.user);
  const { pathname } = useLocation();
  console.log(pathname);
  const profileData = { fullName, bio, bannerUrl, avatarUrl };
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
        <ProfileSidebar username={username} profile={profileData} />
      )}

      <FollowsSidebar />
    </Box>
  );
}
