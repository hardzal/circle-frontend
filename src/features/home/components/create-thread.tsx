import { galleryAddLogo } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import { toaster } from '@/components/ui/toaster';
import { ThreadResponse } from '@/features/thread/dto/thread';
import { api } from '@/libs/api';
import { useAuthStore } from '@/stores/auth';
import {
  createThreadSchema,
  CreateThreadSchemaDTO,
} from '@/utils/schemas/thread.schema';
import {
  Box,
  Button,
  Field,
  Image,
  Input,
  Spinner,
  Textarea,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CreateThread() {
  const {
    user: {
      profile: { fullName, avatar },
    },
  } = useAuthStore();
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateThreadSchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(createThreadSchema),
  });

  const {
    ref: registerImagesRef,
    onChange: registerImagesOnChange,
    ...restRegisterImages
  } = register('images');

  const queryClient = useQueryClient();

  function onClickFile() {
    inputFileRef?.current?.click();
  }

  const { isPending, mutateAsync } = useMutation<
    ThreadResponse,
    Error,
    CreateThreadSchemaDTO
  >({
    mutationKey: ['create-thread'],
    mutationFn: async (data: CreateThreadSchemaDTO) => {
      const formData = new FormData();
      formData.append('content', data.content);

      if (data.images != undefined && data.images.length > 0) {
        formData.append('images', data.images[0]);
      }

      const response = await api.post<ThreadResponse>(`/threads`, formData);
      console.log(response.data);
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
      console.log(data);
      await queryClient.invalidateQueries({
        queryKey: ['threads'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['threadImages'],
      });

      toaster.create({
        title: data.message,
        type: 'success',
      });
    },
  });

  async function onSubmit(data: CreateThreadSchemaDTO) {
    console.log(data);
    await mutateAsync(data);
    reset();
    setPreviewURL('');
  }

  function handlePreview(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      setPreviewURL(url);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        display={'flex'}
        alignItems={'center'}
        gap={'20px'}
        borderBottom={'1px solid'}
        borderBottomColor={'outline'}
        padding={'20px 0px'}
        flexDirection={'column'}
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={'20px'}
          width={'90%'}
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
              placeholder="What is happening?"
              {...register('content')}
            />
            <Field.ErrorText>{errors.content?.message}</Field.ErrorText>
          </Field.Root>

          <Button variant={'ghost'} onClick={onClickFile} type="button">
            <Image src={galleryAddLogo} width={'27px'} />
          </Button>
          <Input
            type={'file'}
            hidden
            {...restRegisterImages}
            onChange={(e) => {
              handlePreview(e);
              registerImagesOnChange(e);
            }}
            ref={(e) => {
              registerImagesRef(e);
              inputFileRef.current = e;
            }}
          />

          <Button
            backgroundColor={'brand'}
            color={'white'}
            type="submit"
            disabled={isPending ? true : false}
          >
            {isPending ? <Spinner /> : 'Post'}
          </Button>
        </Box>
        <Image
          objectFit={'contain'}
          maxHeight={'300px'}
          maxWidth={'300px'}
          src={previewURL ?? ''}
        />
      </Box>
    </form>
  );
}
