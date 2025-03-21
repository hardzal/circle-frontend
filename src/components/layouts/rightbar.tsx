import { useAuthStore } from '@/stores/auth';
import { Box, BoxProps } from '@chakra-ui/react';

import ProfileSidebar from './profile-sidebar';
import FollowsSidebar from './follows-sidebar';
import { useLocation } from 'react-router-dom';
// import { profileLogo } from '@/assets/icons';

export default function RightBar(props: BoxProps) {
  const {
    email,
    username,
    profile: { id, fullName, bio, bannerURL, avatar, userId },
  } = useAuthStore((state) => state.user);

  const { pathname } = useLocation();

  const profileData = {
    id,
    fullName,
    bio,
    bannerURL,
    avatar,
    userId,
  };

  return (
    <Box
      height={'100vh'}
      padding={'0px'}
      {...props}
      position={'fixed'}
      top={'0'}
      right={'0'}
    >
      {pathname !== '/profile' && (
        <ProfileSidebar
          username={username}
          profile={profileData}
          email={email}
        />
      )}

      <FollowsSidebar />
    </Box>
  );
}
