import brandLogo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { registerSchema, RegisterSchemaDTO } from '@/utils/schemas/auth.schema';
import {
  Box,
  BoxProps,
  Link as ChakraLink,
  Field,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toaster } from '@/components/ui/toaster';
import { useNavigate } from 'react-router-dom';
import { api } from '@/libs/api';
import { isAxiosError } from 'axios';
// import axios from 'axios'

export default function RegisterForm(props: BoxProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  async function onSubmit(data: RegisterSchemaDTO) {
    try {
      const response = await api.post('/auth/register', data);
      toaster.create({
        title: response.data.message,
        type: 'success',
      });
      navigate({ pathname: '/login' });
    } catch (error) {
      if (isAxiosError(error)) {
        return toaster.create({
          title: error.response?.data.message,
          type: 'error',
        });
      }

      toaster.create({
        title: 'Something went wrong!',
        type: 'error',
      });
    }

    // console.log(data);
    // navigate({ pathname: '/login' });
    // // send to backend
    // await axios.post("https://backend-circle.com/api/v1/register", data)
  }

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
        <Button backgroundColor={'brand'} color={'white'} type="submit">
          Register
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
