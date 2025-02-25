import { galleryAddLogo } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import { toaster } from '@/components/ui/toaster';
import { api } from '@/libs/api';
import { userSession } from '@/utils/fake-datas/session';
import {
  createThreadSchema,
  CreateThreadSchemaDTO,
} from '@/utils/schemas/thread.schema';
import { Box, Button, Field, Image, Input, Textarea } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function CreateThread() {
  const { fullName, avatarUrl } = userSession;
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateThreadSchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(createThreadSchema),
  });

  const { ref: registerImagesRef, ...resRegisterImages } = register('images');

  function onClickFile() {
    inputFileRef?.current?.click();
  }

  async function onSubmit(data: CreateThreadSchemaDTO) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('content', data.content);
      formData.append('images', data.images[0]);

      const response = await api.post('/threads', formData);

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
      >
        <Avatar
          name={fullName}
          src={avatarUrl}
          shape="full"
          size="full"
          width={'50px'}
          height={'50px'}
        />
        <Field.Root invalid={!!errors.content?.message}>
          <Textarea placeholder="What is happening?" {...register('content')} />
          <Field.ErrorText>{errors.content?.message}</Field.ErrorText>
        </Field.Root>

        <Button variant={'ghost'} onClick={onClickFile}>
          <Image src={galleryAddLogo} width={'27px'} />
        </Button>
        <Input
          type={'file'}
          hidden
          ref={(e) => {
            registerImagesRef(e);
            inputFileRef.current = e;
          }}
          {...resRegisterImages}
        />

        <Button
          backgroundColor={'brand'}
          color={'white'}
          type="submit"
          disabled={isLoading ? true : false}
        >
          {isLoading ? 'Loading...' : 'Post'}
        </Button>
      </Box>
    </form>
  );
}
