import { Grid, GridItem } from '@chakra-ui/react';
import { Navigate, Outlet } from 'react-router-dom';
import LeftBar from './leftbar';
import RightBar from './rightbar';

import { useAuthStore } from '@/stores/auth';

export default function AppLayout() {
  const username = useAuthStore((state) => state.user.username);
  if (!username) return <Navigate to={'/login'} />;

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
