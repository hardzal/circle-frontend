import { Box, Text } from '@chakra-ui/react';
import Home from '../features/home/components/home';
import { useAuthStore } from '@/stores/auth';

export default function HomePage() {
  console.log(useAuthStore((state) => state.user));
  return (
    <Box>
      <Text fontSize={'2xl'} marginLeft={'20px'} marginTop={'20px'}>
        Home
      </Text>
      <Home />
    </Box>
  );
}
