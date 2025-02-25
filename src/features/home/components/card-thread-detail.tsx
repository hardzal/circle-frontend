import { likeLogo, replyLogoOutline } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import { Box, BoxProps, Button, Image, Text } from '@chakra-ui/react';
import { Post } from '../types/posts';
import { formatDate } from '@/utils/format-date';

interface CardThreadDetailProps extends BoxProps {
  postData: Post;
}

export default function CardThreadDetail({ postData }: CardThreadDetailProps) {
  console.info(postData);
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      gap={'16px'}
      borderBottom={'1px solid'}
      borderColor={'outline'}
      padding={'16px 0px'}
    >
      <Box display={'flex'} gap={'4px'}>
        <Avatar
          name={postData.user.fullName}
          src={postData.user.avatarUrl}
          shape="full"
          size="full"
          width={'50px'}
          height={'50px'}
        />
        <Box>
          <Text fontWeight={'bold'}>{postData.user.fullName}</Text>
          <Text color={'secondary'}>@{postData.user.username}</Text>
        </Box>
      </Box>

      <Box display={'flex'} flexDirection={'column'} gap={'4px'}>
        <Text>{postData.content}</Text>

        <Text color={'secondary'}>{formatDate(postData.createdAt)}</Text>

        <Box display={'flex'}>
          <Button
            variant={'ghost'}
            display={'flex'}
            gap={'4px'}
            color={'secondary'}
          >
            <Image src={likeLogo} width={'27px'} />
            <Text>{postData.likesCount}</Text>
          </Button>
          <Button
            variant={'ghost'}
            display={'flex'}
            gap={'4px'}
            color={'secondary'}
          >
            <Image src={replyLogoOutline} width={'27px'} />
            <Text>{postData.repliesCount}</Text>
            <Text>Replies</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
