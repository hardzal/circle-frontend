import brandLogo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import { api } from '@/libs/api';
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaDTO,
} from '@/utils/schemas/auth.schema';
import { Box, BoxProps, Field, Image, Input, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordForm(props: BoxProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit({ email }: ForgotPasswordSchemaDTO) {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/forgot-password', { email });

      toaster.create({
        title: response.data.message,
        type: 'success',
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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

    // send to backend
    // await axios.post("https://backend-circle.com/api/v1/forgot-password", data)
  }

  return (
    <Box display={'flex'} flexDirection={'column'} gap={'12px'} {...props}>
      <Image src={brandLogo} width={'108px'} />
      <Text fontSize={'28px'}>Forgot password</Text>
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
        <Button
          backgroundColor={'brand'}
          color={'white'}
          type="submit"
          disabled={isLoading ? true : false}
        >
          {isLoading ? 'Loading...' : 'Send'}
        </Button>
      </form>
    </Box>
  );
}
