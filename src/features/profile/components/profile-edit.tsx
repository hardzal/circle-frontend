import {
  updateProfileSchema,
  UpdateProfileSchemaDTO,
} from '@/utils/schemas/user.schema';
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Spinner,
  Image,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserResponse } from '../dto/user';
import { api } from '@/libs/api';
import { isAxiosError } from 'axios';
import { toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/auth';
import { LuUpload } from 'react-icons/lu';

interface userProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  bannerURL?: string;
  userId: string;
}

export default function ProfileEdit({
  id,
  fullName,
  username,
  email,
  bio,
  bannerURL,
  avatar,
  userId,
}: userProfile) {
  const [isOpen, setIsOpen] = useState(false);

  const { setUser } = useAuthStore();
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const inputFileAvatarRef = useRef<HTMLInputElement | null>(null);

  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [previewURLAvatar, setPreviewURLAvatar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<UpdateProfileSchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName,
      bio,
    },
  });

  console.log(errors);

  function onClickFile() {
    inputFileRef?.current?.click();
  }
  function onClickFileAvatar() {
    inputFileAvatarRef?.current?.click();
  }

  const {
    ref: registerImagesRef,
    onChange: registerImagesOnChange,
    ...restRegisterImages
  } = register('bannerURL');

  const {
    ref: registerImagesAvatarRef,
    onChange: registerImagesAvatarOnChange,
    ...restRegisterAvatarImages
  } = register('avatar');

  const queryClient = useQueryClient();

  const { isPending: isPendingEditProfile, mutateAsync: mutateEditProfile } =
    useMutation<UserResponse, Error, UpdateProfileSchemaDTO>({
      mutationKey: ['update-profile'],
      mutationFn: async (data: UpdateProfileSchemaDTO) => {
        const formData = new FormData();
        formData.append('fullName', data.fullName);

        if (data.bio !== undefined) {
          formData.append('bio', data.bio);
        }

        if (data.avatar != undefined && data.avatar.length > 0) {
          formData.append('avatar', data.avatar[0]);
        }

        if (data.bannerURL != undefined && data.bannerURL.length > 0) {
          formData.append('bannerURL', data.bannerURL[0]);
        }

        const response = await api.put<UserResponse>(
          `/profiles/${id}`,
          formData
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
          queryKey: ['userProfile'],
        });

        const user = { id: userId, username, email };

        if (data.data !== undefined) {
          setUser({ ...user, profile: data.data });
        }

        toaster.create({
          title: data.message,
          type: 'success',
        });
      },
    });

  async function onUpdateProfile(data: UpdateProfileSchemaDTO) {
    await mutateEditProfile(data);
    console.log(data);
    setPreviewURL('');
    setPreviewURLAvatar('');
    reset();
  }

  function handlePreview(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      setPreviewURL(url);
    }
  }

  function handlePreviewAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      setPreviewURLAvatar(url);
    }
  }

  return (
    <>
      <Dialog.Root
        role="alertdialog"
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
      >
        <Dialog.Trigger asChild>
          <Button
            position={'relative'}
            top={'10px'}
            backgroundColor={'background'}
            color={'white'}
            border={'1px solid white'}
            borderRadius={'30px'}
          >
            Edit Profile
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Edit Profile</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <form
                  onSubmit={handleSubmit(onUpdateProfile)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <Input
                    id="bannerURL"
                    type="file"
                    {...restRegisterImages}
                    onChange={(e) => {
                      console.log(e.target.files);
                      handlePreview(e);
                      registerImagesOnChange(e);
                    }}
                    ref={(e) => {
                      registerImagesRef(e);
                      inputFileRef.current = e;
                    }}
                    hidden
                  />
                  <Button
                    onClick={onClickFile}
                    variant={'ghost'}
                    cursor={'pointer'}
                    position={'absolute'}
                    left="50%" // Move the left edge to 50%
                    top="25%"
                    zIndex={'3'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignContent={'center'}
                    backgroundColor={'blackAlpha.500'}
                  >
                    <LuUpload />
                  </Button>
                  <label
                    htmlFor="bannerURL"
                    style={{ backgroundColor: 'Highlight' }}
                  >
                    <Box
                      backgroundImage={`url("${previewURL || bannerURL}  ")`}
                      padding={'15px'}
                      borderRadius={'lg'}
                      height={'200px'}
                      position={'relative'}
                      backgroundSize={'cover'}
                      zIndex={'1'}
                    ></Box>
                  </label>

                  <Input
                    id="avatar"
                    type="file"
                    {...restRegisterAvatarImages}
                    onChange={(e) => {
                      console.log(e.target.files);
                      handlePreviewAvatar(e);
                      registerImagesAvatarOnChange(e);
                    }}
                    ref={(e) => {
                      registerImagesAvatarRef(e);
                      inputFileAvatarRef.current = e;
                    }}
                    hidden
                  />
                  <Button
                    onClick={onClickFileAvatar}
                    variant={'ghost'}
                    cursor={'pointer'}
                    position={'absolute'}
                    top={'45%'}
                    left={'10%'}
                    zIndex={'11'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignContent={'center'}
                    backgroundColor={'blackAlpha.200'}
                  >
                    <LuUpload />
                  </Button>
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    zIndex={'10'}
                    position={'relative'}
                    bottom={'30px'}
                  >
                    <label htmlFor="avatar">
                      <Image
                        src={previewURLAvatar || avatar || ''}
                        boxSize="80px"
                        borderRadius="full"
                        backgroundColor={'background'}
                        border={'1px solid background'}
                        fit="cover"
                        marginLeft={'15px'}
                        alt={fullName}
                      />
                    </label>
                  </Box>
                  <Field.Root>
                    <Input
                      placeholder="Full Name"
                      value={watch('fullName')}
                      {...register('fullName')}
                    />
                    <Field.ErrorText>
                      {errors.fullName?.message}
                    </Field.ErrorText>
                  </Field.Root>
                  <Field.Root>
                    <Input
                      placeholder="Bio"
                      value={watch('bio')}
                      {...register('bio')}
                    />
                    <Field.ErrorText>{errors.bio?.message}</Field.ErrorText>
                  </Field.Root>

                  <Button
                    backgroundColor={'brand'}
                    color={'white'}
                    type="submit"
                    disabled={isPendingEditProfile ? true : false}
                  >
                    {isPendingEditProfile ? <Spinner /> : 'Update'}
                  </Button>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
