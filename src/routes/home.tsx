import { Box, Text } from '@chakra-ui/react';
import Home from '../features/home/components/home';

export default function HomePage() {
  return (
    <Box>
      <Text fontSize={'2xl'} marginLeft={'20px'} marginTop={'20px'}>
        Home
      </Text>
      <Home />
    </Box>
  );
}
