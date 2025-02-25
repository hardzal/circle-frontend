import brandLogo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import {
  Box,
  BoxProps,
  Field,
  Image,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useForgotPasswordForm } from '../hooks/use-forgot-password-form';

export default function ForgotPasswordForm(props: BoxProps) {
  const { errors, handleSubmit, isPending, onSubmit, register } =
    useForgotPasswordForm();

  // send to backend
  // await axios.post("https://backend-circle.com/api/v1/forgot-password", data)

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
          disabled={isPending ? true : false}
        >
          {isPending ? <Spinner /> : 'Send'}
        </Button>
      </form>
    </Box>
  );
}
