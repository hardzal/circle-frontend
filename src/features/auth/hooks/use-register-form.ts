import { toaster } from '@/components/ui/toaster';
import { api } from '@/libs/api';
import { registerSchema, RegisterSchemaDTO } from '@/utils/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface RegisterResponse {
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function useRegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterSchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const { isPending, mutateAsync } = useMutation<
    RegisterResponse,
    Error,
    RegisterSchemaDTO
  >({
    mutationKey: ['register'],
    mutationFn: async (data: RegisterSchemaDTO) => {
      const response = await api.post<RegisterResponse>(`/auth/register`, data);
      console.log(response);
      return response.data;
    },

    onError: async (error) => {
      if (isAxiosError(error)) {
        console.log(error.response?.data.message);
        return toaster.create({
          title: error.response?.data.message,
          type: 'error',
        });
      }
      console.log('error here');
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

  async function onSubmit(data: RegisterSchemaDTO) {
    try {
      await mutateAsync(data);
      reset();
    } catch (error) {
      if (isAxiosError(error)) {
        toaster.create({
          title: error.response?.data.message,
          type: 'error',
        });
      } else {
        toaster.create({
          title: 'Something went wrong!',
          type: 'error',
        });
      }
    }
  }

  return {
    onSubmit,
    isPending,
    handleSubmit,
    register,
    errors,
  };
}
