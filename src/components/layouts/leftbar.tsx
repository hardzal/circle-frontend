import brandLogo from '@/assets/logo.svg';
import logoutIcon from '@/assets/icons/logout.svg';
import { NAV_LINK_MENU, NavLinkMenu } from '@/utils/constants/nav-link-menu';
import {
  Box,
  BoxProps,
  Button,
  Link as ChakraLink,
  Field,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from '@/components/ui/dialog';
import { galleryAddLogo } from '@/assets/icons';
import { useAuthStore } from '@/stores/auth';
import Cookies from 'js-cookie';
import { useCreateThreads } from '@/features/home/hooks/use-create-thread';

export default function LeftBar(props: BoxProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const {
    register,
    onSubmit,
    errors,
    handleSubmit,
    handlePreview,
    isPending,
    previewURL,
    inputFileRef,
  } = useCreateThreads();

  function onClickFile() {
    inputFileRef?.current?.click();
  }

  const {
    ref: registerImagesRef,
    onChange: registerImagesOnChange,
    ...restRegisterImages
  } = register('images');

  function onLogout() {
    if (!confirm('are you sure logout?')) {
      return;
    }
    logout();
    // localStorage.removeItem('token');
    Cookies.remove('token');
    navigate('/login');
  }

  const NEW_NAV_LINK: NavLinkMenu[] = NAV_LINK_MENU.map((value) => {
    if (value.label === 'Follows') {
      return { ...value, path: `/follows/${user.username}` };
    }
    return value;
  });

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      position={'fixed'}
      top={'0'}
      left={'0'}
      width={'23%'}
    >
      <Box padding={'40px'} {...props}>
        <Image src={brandLogo} width={'220px'} padding={'0px 16px'} />
        <Box
          marginTop={'22px'}
          display={'flex'}
          flexDirection={'column'}
          gap={'8px'}
        >
          {NEW_NAV_LINK.map(({ label, logo, path }, index) => (
            <ChakraLink
              asChild
              display={'flex'}
              gap={'16px'}
              alignItems={'center'}
              padding={'16px 20px'}
              key={index}
            >
              <Link to={path}>
                <Image
                  src={pathname === path ? logo.fill : logo.outline}
                  width={'27px'}
                />
                <Text>{label}</Text>
              </Link>
            </ChakraLink>
          ))}

          <DialogRoot size="lg">
            <DialogTrigger asChild>
              <ChakraLink
                asChild
                display={'flex'}
                gap={'16px'}
                alignItems={'center'}
                padding={'16px 20px'}
              >
                <Button
                  backgroundColor={'brand'}
                  color={'white'}
                  borderRadius={'50px'}
                >
                  Create Post
                </Button>
              </ChakraLink>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogBody
                  marginTop={'35px'}
                  display={'flex'}
                  justifyContent={'center'}
                  alignItems={'center'}
                  flexDirection={'column'}
                >
                  <Field.Root invalid={!!errors.content?.message}>
                    <Textarea
                      placeholder="What is happening?!"
                      {...register('content')}
                    />
                    <Field.ErrorText>{errors.content?.message}</Field.ErrorText>
                  </Field.Root>
                  <Image
                    objectFit={'contain'}
                    maxHeight={'300px'}
                    maxWidth={'300px'}
                    marginTop={'10px'}
                    src={previewURL ?? ''}
                  />
                </DialogBody>
                <DialogFooter display={'flex'} flex={'content'}>
                  <Button variant={'ghost'} onClick={onClickFile}>
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
                    disabled={isPending ? true : false}
                    type="submit"
                  >
                    {isPending ? <Spinner /> : 'Post'}
                  </Button>
                </DialogFooter>
                <DialogCloseTrigger />
              </form>
            </DialogContent>
          </DialogRoot>
        </Box>
      </Box>
      <Box
        display={'flex'}
        gap={'10px'}
        position={'relative'}
        bottom={'-42vh'}
        padding={'20px'}
      >
        <Button onClick={onLogout} variant={'ghost'}>
          <Image src={logoutIcon} width={'30px'} />
          <Text>Logout</Text>
        </Button>
      </Box>
    </Box>
  );
}
