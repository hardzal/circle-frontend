import { toaster } from '@/components/ui/toaster';
import { api } from '@/libs/api';
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaDTO,
} from '@/utils/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';

export function useForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { isPending, mutateAsync } = useMutation<
    { message: string },
    AxiosError,
    ForgotPasswordSchemaDTO
  >({
    mutationKey: ['forgot-password'],
    mutationFn: async ({ email }: ForgotPasswordSchemaDTO) => {
      const response = await api.post(`/auth/forgot-password`, { email });

      return response.data;
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        return toaster.create({
          title: (error.response?.data as { message: string }).message,
          type: 'error',
        });
      }
    },

    onSuccess: async (data) => {
      toaster.create({
        title: data.message,
        type: 'success',
      });
    },
  });

  async function onSubmit(data: ForgotPasswordSchemaDTO) {
    await mutateAsync(data);
  }

  return {
    register,
    onSubmit,
    handleSubmit,
    errors,
    isPending,
  };
}
