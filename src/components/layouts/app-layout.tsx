import { isLogin } from '@/utils/fake-datas/session';
import { Grid, GridItem } from '@chakra-ui/react';
import { Navigate, Outlet } from 'react-router-dom';
import LeftBar from './leftbar';
import RightBar from './rightbar';

export default function AppLayout() {
  if (!isLogin) return <Navigate to={'/login'} />;

  return (
    <Grid templateColumns="repeat(4, 1fr)">
      <GridItem colSpan={1} display={{ base: 'none', lg: 'block' }}>
        <LeftBar />
      </GridItem>

      <GridItem
        colSpan={{ base: 4, lg: 2 }}
        padding={'40px'}
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
