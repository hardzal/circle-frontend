import { FollowingEntity } from '@/entities/following.entity';
import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { useState } from 'react';
import { useFollow } from '../hooks/use-follow';
import { useUnfollow } from '../hooks/use-unfollow';
type Props = {
  userId: string;
  searchUserData: FollowingEntity;
};
export default function ButtonFollow({ userId, searchUserData }: Props) {
  const { isPendingFollow, onFollow } = useFollow(userId);

  const { isPendingUnfollow, onUnfollow } = useUnfollow();

  const [buttonText, setButtonText] = useState<string>('Following');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleOverButton = () => {
    setIsHovered(true);
    setButtonText('Unfollow');
  };

  const handleOutButton = () => {
    setIsHovered(false);
    setButtonText('Following');
  };

  const defaultStyle = {
    color: 'white',
    border: '1px solid white',
  };

  const hoveredStyle = {
    color: 'red',
    border: '1px solid red',
  };

  return (
    <Button
      variant={'outline'}
      flex={'1'}
      borderRadius={'30px'}
      disabled={isPendingFollow || isPendingUnfollow}
      onClick={() =>
        searchUserData?.isFollowed
          ? onUnfollow({ followedId: searchUserData.id })
          : onFollow({ followedId: searchUserData.id })
      }
      style={isHovered ? hoveredStyle : defaultStyle}
      onMouseOver={handleOverButton}
      onMouseOut={handleOutButton}
      key={searchUserData.id}
    >
      <Dialog.Root role="alertdialog">
        <Dialog.Trigger asChild>
          <Button variant="outline" size="sm">
            {buttonText}
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Are you sure?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>
                  Their thread and will no longer show up in your following
                  timeline.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette="red">Delete</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Button>
  );
}
