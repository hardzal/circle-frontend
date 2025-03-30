import { useFollow } from '../hooks/use-follow';
import { Button } from '@chakra-ui/react';
import { FollowToggleEntity } from '@/entities/followtoggle.entity';

type Props = {
  userId: string;
  searchUserData: FollowToggleEntity;
  buttonStyle: React.CSSProperties;
};

export default function ButtonFollow({
  userId,
  searchUserData,
  buttonStyle,
}: Props) {
  const { isPendingFollow, onFollow } = useFollow(userId);

  return (
    <>
      <Button
        variant={'outline'}
        border={'1px solid white'}
        borderRadius={'30px'}
        disabled={isPendingFollow}
        style={buttonStyle}
        onClick={() =>
          onFollow({ followedId: searchUserData?.following?.id as string })
        }
      >
        {searchUserData?.isFollowing ? 'Follow back' : 'Follow'}
      </Button>
    </>
  );
}
