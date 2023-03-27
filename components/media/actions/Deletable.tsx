import { Button, Modal, useToast } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../../../App';
import { userAtom } from '../../../utils/atoms';
import {
  Post as PostObj,
  Comment as CommentObj,
  invalidateDocRefId,
} from '../../../xplat/types';

type Props = {
  isConfirming: boolean;
  media: PostObj | CommentObj;
  close: () => void;
};
const Deletable = ({ isConfirming, media, close }: Props) => {
  const toast = useToast();

  const signedInUser = useRecoilValue(userAtom);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteAndClose = () => {
    if (signedInUser === undefined) return;
    setIsLoading(true);
    media
      .delete()
      .then(() => {
        toast.show({
          title: 'Content deleted',
          placement: 'top',
        });

        invalidateDocRefId(media.getId());
        queryClient.invalidateQueries(media.getId());
      })
      .catch((error) => {
        console.error(error);
        toast.show({
          title: 'Something went wrong, please try again',
          placement: 'top',
        });
      })
      .finally(() => {
        setIsLoading(false);
        close();
      });
  };

  return (
    <Modal isOpen={isConfirming} onClose={close}>
      <Modal.Content maxWidth="lg">
        <Modal.CloseButton />
        <Modal.Header>Delete</Modal.Header>
        <Modal.Body>Are you sure you want to delete this content?</Modal.Body>
        <Modal.Footer>
          <Button onPress={close} variant="unstyled" colorScheme="coolGray">
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            onPress={deleteAndClose}
            colorScheme="danger"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default Deletable;
