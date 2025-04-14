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
  const { username: usernameParam } = useParams();
  const username = usernameParam ?? usernameLogin;

  const navigate = useNavigate();

  const {
    data: profileData,
    isPending,
    isError,
    failureReason,
  } = useQuery<ProfileEntity>({
    queryKey: ['profileFollows', username],
    enabled: !!username,
    queryFn: async () => {
      const response = await api.get(`/users/${username}`);
      return response.data.data.profile;
    },
  });

  useEffect(() => {
    if (!!username && !isPending && !profileData) {
      navigate('/NotFound', { replace: true });
    }
  }, [username, isPending, profileData, navigate]);

  if (isError) {
    return failureReason?.message;
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
          {profileData?.userId && (
            <FollowedList
              key="1"
              title="Followers Data"
              profile={profileData as ProfileEntity}
            />
          )}
        </Tabs.Content>
        <Tabs.Content value="followings">
          {profileData?.userId && (
            <FollowingList
              key="2"
              title="Followings data"
              profile={profileData as ProfileEntity}
            />
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
