import { likeLogo } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import { Box, Button, Image, Text } from '@chakra-ui/react';
import { ReplyEntity } from '@/entities/reply.entity';

export default function CardReply(reply: ReplyEntity) {
  return (
    <Box
      display={'flex'}
      gap={'16px'}
      borderBottom={'1px solid'}
      borderColor={'outline'}
      padding={'30px 0px'}
    >
      <Avatar
        name={reply.user?.profile?.fullName || ''}
        src={reply.user?.profile?.avatar || ''}
        shape="full"
        size="full"
        width={'50px'}
        height={'50px'}
      />

      <Box display={'flex'} flexDirection={'column'} gap={'4px'}>
        <Box display={'flex'} gap={'4px'}>
          <Text fontWeight={'bold'}>{reply.user?.profile?.fullName}</Text>
          <Text color={'secondary'}>@{reply.user?.username}</Text>
          <Text color={'secondary'}>•</Text>
          <Text color={'secondary'}>
            {new Date(reply.createdAt).getHours()}h
          </Text>
        </Box>
        <Text cursor={'pointer'}>{reply.content}</Text>
        <Box display={'flex'}>
          <Button variant={'ghost'} display={'flex'} gap={'4px'}>
            <Image src={likeLogo} width={'27px'} />
            <Text>{'??'}</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
