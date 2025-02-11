import brandLogo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toaster';
import { userDatas } from '@/utils/fake-datas/user';
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaDTO,
} from '@/utils/schemas/auth.schema';
import { Box, BoxProps, Field, Image, Input, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordForm(props: BoxProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordSchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordSchemaDTO) {
    const user = userDatas.find(
      (userData) => userData.email === watch('email')
    );

    if (!user)
      return toaster.create({
        title: 'Email/password is wrong!',
        type: 'error',
      });

    toaster.create({
      title: 'Reset password link has been sent to your email! Check it out!',
      type: 'success',
    });

    console.log(data);
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
        <Button backgroundColor={'brand'} color={'white'} type="submit">
          Send
        </Button>
      </form>
    </Box>
  );
}
