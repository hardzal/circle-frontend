import brandLogo from '@/assets/logo.svg';
import logoutIcon from '@/assets/icons/logout.svg';
import { NAV_LINK_MENU, NavLinkMenu } from '@/utils/constants/nav-link-menu';
import {
  Box,
  BoxProps,
  Button,
  Link as ChakraLink,
  Image,
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
import { useRef } from 'react';
import { useAuthStore } from '@/stores/auth';
import Cookies from 'js-cookie';

export default function LeftBar(props: BoxProps) {
  const { pathname } = useLocation();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  function onClickFile() {
    inputFileRef?.current?.click();
  }

  function onLogout() {
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
              <DialogBody marginTop={'35px'}>
                <Textarea placeholder="What is happening?!" />
              </DialogBody>
              <DialogFooter display={'flex'} flex={'content'}>
                <Button
                  variant={'ghost'}
                  onClick={onClickFile}
                  disabled
                  cursor={'disabled'}
                >
                  <Image src={galleryAddLogo} width={'27px'} />
                </Button>

                <Button backgroundColor={'brand'} disabled color={'white'}>
                  Post
                </Button>
              </DialogFooter>
              <DialogCloseTrigger />
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
