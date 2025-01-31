import {
  Box,
  Field,
  Image,
  Input,
  Text,
  Link as ChakraLink,
  BoxProps,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import brandLogo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';

export default function LoginForm(props: BoxProps) {
  return (
    <Box display={'flex'} flexDirection={'column'} gap={'12px'} {...props}>
      <Image src={brandLogo} width={'108px'} />
      <Text fontSize={'28px'}>Login to Circle</Text>
      <Field.Root>
        <Input placeholder="Email/Username" />
        <Field.ErrorText>This is an error text</Field.ErrorText>
      </Field.Root>
      <Field.Root>
        <Input placeholder="Password" type="password" />
        <Field.ErrorText>This is an error text</Field.ErrorText>
      </Field.Root>
      <Box display={'flex'} justifyContent={'flex-end'}>
        <ChakraLink asChild>
          <Link to={'/forgot-password'}>Forgot password?</Link>
        </ChakraLink>
      </Box>
      <Button backgroundColor={'brand'} color={'white'}>
        Login
      </Button>
      <Text as="span">
        Don't have an account yet?{' '}
        <ChakraLink asChild color={'brand'}>
          <Link to={'/register'}>Create account</Link>
        </ChakraLink>
      </Text>
    </Box>
  );
}
