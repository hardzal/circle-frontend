import { useAuthStore } from '@/stores/auth';
import { useParams } from 'react-router-dom';
import { toaster } from '@/components/ui/toaster';
import { Box, Button, Field, Spinner, Textarea } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import {
  createReplySchema,
  CreateReplySchemaDTO,
} from '@/utils/schemas/reply.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/libs/api';
import { ReplyResponse } from '@/features/reply/dto/reply';
import { isAxiosError } from 'axios';

interface CreateReplyProps {
  thread?: string;
}

export default function CreateReply({ thread }: CreateReplyProps) {
  let { threadId } = useParams();

  if (threadId === null || threadId === undefined) {
    threadId = thread;
  }

  const {
    user: {
      profile: { fullName, avatar },
    },
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateReplySchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(createReplySchema),
  });

  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    ReplyResponse,
    Error,
    CreateReplySchemaDTO
  >({
    mutationKey: ['create-reply'],
    mutationFn: async (data: CreateReplySchemaDTO) => {
      const response = await api.post<ReplyResponse>(
        `/replies/${threadId}`,
        data
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
      await queryClient.invalidateQueries({
        queryKey: [`threads/${threadId}`],
      });

      await queryClient.invalidateQueries({
        queryKey: ['replyData'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['replyDataImages'],
      });

      toaster.create({
        title: data.message,
        type: 'success',
      });
    },
  });

  async function onSubmit(data: CreateReplySchemaDTO) {
    await mutateAsync(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        display={'flex'}
        alignItems={'center'}
        gap={'20px'}
        padding={'20px 20px'}
      >
        <Avatar
          name={fullName}
          src={avatar || ''}
          shape="full"
          size="full"
          width={'50px'}
          height={'50px'}
        />
        <Field.Root invalid={!!errors.content?.message}>
          <Textarea
            placeholder="What is happening?!"
            {...register('content')}
          />
          <Field.ErrorText>{errors.content?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          backgroundColor={'brand'}
          color={'white'}
          disabled={isPending ? true : false}
        >
          {isPending ? <Spinner /> : 'Reply'}
        </Button>
      </Box>
    </form>
  );
}
