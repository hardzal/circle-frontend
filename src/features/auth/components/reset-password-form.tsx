import brandLogo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import { api } from '@/libs/api';
import {
  resetPasswordSchema,
  ResetPasswordSchemaDTO,
} from '@/utils/schemas/auth.schema';
import { Box, BoxProps, Field, Image, Input, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPasswordForm(props: BoxProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaDTO>({
    mode: 'all',
    resolver: zodResolver(resetPasswordSchema),
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = searchParams.get('item');

  async function onSubmit({
    oldPassword,
    newPassword,
  }: ResetPasswordSchemaDTO) {
    setIsLoading(true);

    try {
      setIsLoading(true);
      const response = await api.post(
        '/auth/reset-password',
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toaster.create({
        title: response.data.message,
        type: 'success',
      });
      navigate({ pathname: '/login' });
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

  console.log('errors', errors);

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
        <Field.Root invalid={!!errors.oldPassword?.message}>
          <Input
            placeholder="Password"
            type="password"
            {...register('oldPassword')}
          />
          <Field.ErrorText>{errors.oldPassword?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.newPassword?.message}>
          <Input
            placeholder="Confirm password"
            type="password"
            {...register('newPassword')}
          />
          <Field.ErrorText>{errors.newPassword?.message}</Field.ErrorText>
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
