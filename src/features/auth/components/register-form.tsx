import brandLogo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import {
  Box,
  BoxProps,
  Link as ChakraLink,
  Field,
  Image,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useRegisterForm } from '../hooks/use-register-form';
// import axios from 'axios'

export default function RegisterForm(props: BoxProps) {
  const { errors, handleSubmit, isPending, onSubmit, register } =
    useRegisterForm();
  // console.log(data);
  // navigate({ pathname: '/login' });
  // // send to backend
  // await axios.post("https://backend-circle.com/api/v1/register", data)

  return (
    <Box display={'flex'} flexDirection={'column'} gap={'12px'} {...props}>
      <Image src={brandLogo} width={'108px'} />
      <Text fontSize={'28px'}>Create an Account to Circle</Text>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <Field.Root invalid={!!errors.fullName?.message}>
          <Input placeholder="Full Name" {...register('fullName')} />
          <Field.ErrorText>{errors.fullName?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.username?.message}>
          <Input placeholder="Username" {...register('username')} />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>
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
        <Button
          backgroundColor={'brand'}
          color={'white'}
          type="submit"
          disabled={isPending ? true : false}
        >
          {isPending ? <Spinner /> : 'Register'}
        </Button>
      </form>
      <Text as="span">
        Already have account?{' '}
        <ChakraLink asChild color={'brand'}>
          <Link to={'/login'}>Login</Link>
        </ChakraLink>
      </Text>
    </Box>
  );
}
