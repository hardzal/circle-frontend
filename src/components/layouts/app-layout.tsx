import { Grid, GridItem } from '@chakra-ui/react';
import { Navigate, Outlet } from 'react-router-dom';
import LeftBar from './leftbar';
import RightBar from './rightbar';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import Cookies from 'js-cookie';
import { api } from '@/libs/api';

export default function AppLayout() {
  const {
    user: { username },
    setUser,
    logout,
  } = useAuthStore();

  const { isFetched } = useQuery({
    queryKey: ['check-auth'],
    queryFn: async () => {
      try {
        const token = Cookies.get('token');
        const response = await api.post(
          `/auth/check`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data.data);
        return response.data;
      } catch (error) {
        console.log(error);
        Cookies.remove('token');
        logout();
      }
    },
  });

  if (isFetched) {
    if (!username) return <Navigate to="/login" />;
    return (
      <Grid templateColumns="repeat(4, 1fr)">
        <GridItem colSpan={1} display={{ base: 'none', lg: 'block' }}>
          <LeftBar />
        </GridItem>

        <GridItem
          colSpan={{ base: 4, lg: 2 }}
          borderX={'1px solid'}
          borderColor={'outline'}
        >
          <Outlet />
        </GridItem>

        <GridItem colSpan={1} display={{ base: 'none', lg: 'block' }}>
          <RightBar />
        </GridItem>
      </Grid>
    );
  }

  return <></>;
}
