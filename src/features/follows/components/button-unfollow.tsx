import { FollowingEntity } from '@/entities/following.entity';
import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { useState } from 'react';
import { useUnfollow } from '../hooks/use-unfollow';
type Props = {
  userId: string;
  searchUserData: FollowingEntity;
};
export default function ButtonUnfollow({ searchUserData }: Props) {
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

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dialog.Root
        role="alertdialog"
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
      >
        <Dialog.Trigger asChild>
          <Button
            variant={'outline'}
            flex={'1'}
            borderRadius={'30px'}
            colorPalette="red"
            style={isHovered ? hoveredStyle : defaultStyle}
            onMouseOver={handleOverButton}
            onMouseOut={handleOutButton}
            key={searchUserData.id}
          >
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
                <Button
                  disabled={isPendingUnfollow}
                  onClick={() => {
                    onUnfollow({ followedId: searchUserData.id });
                    setIsOpen(false);
                  }}
                >
                  Unfollow
                </Button>
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
