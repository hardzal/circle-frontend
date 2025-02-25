import { toaster } from '@/components/ui/toaster';
import { api } from '@/libs/api';
import {
  resetPasswordSchema,
  ResetPasswordSchemaDTO,
} from '@/utils/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface ResetPasswordResponse {
  message: string;
  data: {
    id: string;
    email: string;
    updatedAt: string;
  };
}

export function usePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordSchemaDTO>({
    mode: 'all',
    resolver: zodResolver(resetPasswordSchema),
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { isPending, mutateAsync } = useMutation<
    ResetPasswordResponse,
    Error,
    ResetPasswordSchemaDTO
  >({
    mutationKey: ['reset-password'],
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: ResetPasswordSchemaDTO) => {
      const response = await api.post<ResetPasswordResponse>(
        `/auth/reset-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },

    onError: (error) => {
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
    },

    onSuccess: async (data) => {
      toaster.create({
        title: data.message,
        type: 'success',
      });

      navigate({ pathname: '/login' });
    },
  });

  async function onSubmit(data: ResetPasswordSchemaDTO) {
    await mutateAsync(data);
    reset();
  }

  return {
    register,
    onSubmit,
    isPending,
    handleSubmit,
    errors,
  };
}
