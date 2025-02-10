import { galleryAddLogo } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import { userSession } from '@/utils/fake-datas/session';
import { Box, Button, Image, Input, Textarea } from '@chakra-ui/react';
import { useRef } from 'react';

export default function CreateThread() {
  const { fullName, avatarUrl } = userSession;
  const inputFileRef = useRef<HTMLInputElement>(null);

  function onClickFile() {
    inputFileRef?.current?.click();
  }

  return (
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
      <Textarea placeholder="What is happening?!" />

      <Button
        variant={'ghost'}
        onClick={onClickFile}
        disabled
        cursor={'disabled'}
      >
        <Image src={galleryAddLogo} width={'27px'} />
      </Button>
      <Input type={'file'} hidden ref={inputFileRef} />

      <Button backgroundColor={'brand'} disabled color={'white'}>
        Post
      </Button>
    </Box>
  );
}
