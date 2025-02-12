import { likeLogo, likeLogoOutline, replyLogoOutline } from '@/assets/icons';
import { Avatar } from '@/components/ui/avatar';
import { Box, BoxProps, Button, Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types/posts';
import { useReducer } from 'react';

interface CardThreadProps extends BoxProps {
  postData: Post;
}

export default function CardThread({ postData }: CardThreadProps) {
  const navigate = useNavigate();
  const [, forceUpdate] = useReducer((state) => state + 1, 0);

  function onClickCard() {
    navigate(`/thread/${postData.id}`);
  }

  return (
    <Box
      display={'flex'}
      gap={'16px'}
      borderBottom={'1px solid'}
      borderColor={'outline'}
      padding={'16px'}
    >
      <Avatar
        name={postData.user.fullName}
        src={postData.user.avatarUrl}
        shape="full"
        size="full"
        width={'50px'}
        height={'50px'}
      />

      <Box display={'flex'} flexDirection={'column'} gap={'4px'}>
        <Box display={'flex'} gap={'4px'}>
          <Text fontWeight={'bold'}>{postData.user.fullName}</Text>
          <Text color={'secondary'}>@{postData.user.username}</Text>
          <Text color={'secondary'}>•</Text>
          <Text color={'secondary'}>{postData.createdAt.getHours()}h</Text>
        </Box>
        <Text cursor={'pointer'} onClick={onClickCard}>
          {postData.content}
        </Text>
        <Box display={'flex'}>
          <Button
            variant={'ghost'}
            display={'flex'}
            gap={'4px'}
            onClick={() => {
              postData.isLiked = !postData.isLiked;
              forceUpdate();
            }}
          >
            <Image
              src={postData.isLiked ? likeLogo : likeLogoOutline}
              width={'27px'}
            />
            <Text>{postData.likesCount}</Text>
          </Button>

          <Button variant={'ghost'} display={'flex'} gap={'4px'}>
            <Image src={replyLogoOutline} width={'27px'} />
            <Text>{postData.repliesCount}</Text>
            <Text cursor={'pointer'} onClick={onClickCard}>
              Replies
            </Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
