import { useFollow } from '../hooks/use-follow';
import { Button } from '@chakra-ui/react';
import { FollowToggleEntity } from '@/entities/followtoggle.entity';

type Props = {
  userId: string;
  searchUserData: FollowToggleEntity;
};

export default function ButtonFollow({ userId, searchUserData }: Props) {
  const { isPendingFollow, onFollow } = useFollow(userId);
  console.log('Data', searchUserData);
  return (
    <>
      <Button
        variant={'outline'}
        flex={'1'}
        border={'1px solid white'}
        borderRadius={'30px'}
        disabled={isPendingFollow}
        onClick={() =>
          onFollow({ followedId: searchUserData?.following?.id as string })
        }
      >
        {searchUserData?.isFollowing ? 'Following' : 'Follow back'}
      </Button>
    </>
  );
}
