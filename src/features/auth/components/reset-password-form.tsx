import brandLogo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import { userDatas } from '@/utils/fake-datas/user';
import {
  resetPasswordSchema,
  ResetPasswordSchemaDTO,
} from '@/utils/schemas/auth.schema';
import { Box, BoxProps, Field, Image, Input, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPasswordForm(props: BoxProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordSchemaDTO>({
    mode: 'all',
    resolver: zodResolver(resetPasswordSchema),
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get('email');

  async function onSubmit(data: ResetPasswordSchemaDTO) {
    const user = userDatas.find((userData) => userData.email === email);

    if (!user)
      return toaster.create({
        title: 'Email is not valid!',
        type: 'error',
      });

    if (user.password === watch('password'))
      return toaster.create({
        title: 'Password cannot be the same as previous!',
        type: 'error',
      });

    toaster.create({
      title: 'Reset password success!',
      type: 'success',
    });

    console.log(data);
    navigate({ pathname: '/login' });
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
        <Field.Root invalid={!!errors.password?.message}>
          <Input
            placeholder="Password"
            type="password"
            {...register('password')}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.confirmPassword?.message}>
          <Input
            placeholder="Confirm password"
            type="password"
            {...register('confirmPassword')}
          />
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
        </Field.Root>
        <Button backgroundColor={'brand'} color={'white'} type="submit">
          Send
        </Button>
      </form>
    </Box>
  );
}
