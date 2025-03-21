import {
  updateProfileSchema,
  UpdateProfileSchemaDTO,
} from '@/utils/schemas/user.schema';
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Spinner,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserResponse } from '../dto/user';
import { api } from '@/libs/api';
import { isAxiosError } from 'axios';
import { toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/stores/auth';

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
  userId,
}: userProfile) {
  const [isOpen, setIsOpen] = useState(false);

  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdateProfileSchemaDTO>({
    mode: 'onChange',
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: fullName,
      bio: bio,
    },
  });

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
                  <Field.Root>
                    <Input placeholder="Username" value={username} disabled />
                  </Field.Root>
                  <Field.Root>
                    <Input placeholder="Email" value={email} disabled />
                  </Field.Root>
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
                    onClick={(e) => {
                      e.currentTarget?.blur();
                      handleSubmit(onUpdateProfile)();
                      console.log('submitted');
                    }}
                  >
                    {isPendingEditProfile ? <Spinner /> : 'Update'}
                  </Button>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Close</Button>
                </Dialog.ActionTrigger>
                {/* <Button
                        bgColor={'brand'}
                        onClick={() => {
                          setIsOpen(false);
                        }}
                      >
                        Submit
                      </Button> */}
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
