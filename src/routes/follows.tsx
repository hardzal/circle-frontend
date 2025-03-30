import { ProfileEntity } from '@/entities/profile.entity';
import FollowedList from '@/features/follows/followed-list';
import FollowingList from '@/features/follows/following-list';
import { api } from '@/libs/api';
import { useAuthStore } from '@/stores/auth';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { Link, Tabs } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function FollowsPage() {
  const usernameLogin = useAuthStore((state) => state.user).username;
  const { username } = useParams() || usernameLogin;
  const navigate = useNavigate();

  const { data: profileData, isPending } = useQuery<ProfileEntity>({
    queryKey: ['profileFollows'],
    queryFn: async () => {
      const response = await api.get(`/users/${username}`);

      const { profile } = response.data.data;

      return profile;
    },
  });

  useEffect(() => {
    setTimeout(() => {
      if (profileData?.userId === undefined) {
        navigate('/NotFound', { replace: true });
      }
    }, 1000);
  }, [profileData, navigate]);

  if (!profileData) {
    return null;
  }

  return (
    <Box display={'flex'} flexDirection={'column'}>
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <Text as={'h1'} fontSize={'2xl'} margin={'20px'}>
            {profileData?.fullName}
          </Text>
          <Text as={'p'} marginLeft={'20px'}>
            @{username}
          </Text>
        </>
      )}

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
          <FollowedList
            key="1"
            title="Followers Data"
            profile={profileData as ProfileEntity}
          />
        </Tabs.Content>
        <Tabs.Content value="followings">
          <FollowingList
            key="2"
            title="Followings data"
            profile={profileData as ProfileEntity}
          />
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
