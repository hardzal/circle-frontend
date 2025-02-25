import {
  Box,
  Field,
  Image,
  Input,
  Text,
  Link as ChakraLink,
  BoxProps,
  Spinner,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import brandLogo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { useLoginForm } from '../hooks/use-login-form';

export default function LoginForm(props: BoxProps) {
  const { errors, handleSubmit, isPending, onSubmit, register } =
    useLoginForm();

  // send to backend
  // await axios.post("https://backend-circle.com/api/v1/login", data)

  return (
    <Box display={'flex'} flexDirection={'column'} gap={'12px'} {...props}>
      <Image src={brandLogo} width={'108px'} />
      <Text fontSize={'28px'}>Login to Circle</Text>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <Field.Root invalid={!!errors.email?.message}>
          <Input placeholder="Email" {...register('email')} />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.password?.message}>
          <Input
            placeholder="Password"
            type="password"
            {...register('password')}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <ChakraLink asChild>
            <Link to={'/forgot-password'}>Forgot password?</Link>
          </ChakraLink>
        </Box>
        <Button
          backgroundColor={'brand'}
          color={'white'}
          type="submit"
          disabled={isPending ? true : false}
        >
          {isPending ? <Spinner /> : 'Login'}
        </Button>
      </form>
      <Text as="span">
        Don't have an account yet?{' '}
        <ChakraLink asChild color={'brand'}>
          <Link to={'/register'}>Create account</Link>
        </ChakraLink>
      </Text>
    </Box>
  );
}
