import { Button, Modal, useToast } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../../utils/atoms';
import { useGenericErrorToast } from '../../../utils/hooks';
import {
  Comment as CommentObj,
  Post as PostObj,
  UserActionError,
  User as UserObj,
} from '../../../xplat/types';

type Props = {
  isConfirming: boolean;
  media: PostObj | CommentObj | UserObj;
  close: () => void;
};
const Reportable = ({ isConfirming, media, close }: Props) => {
  const toast = useToast();
  const genericToast = useGenericErrorToast();

  const signedInUser = useRecoilValue(userAtom);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const reportAndClose = () => {
    if (signedInUser === undefined) return;
    setIsLoading(true);
    signedInUser
      .addReport(media)
      .then(() =>
        toast.show({
          title: 'Report submitted',
          placement: 'top',
        })
      )
      .catch((error) => {
        var msg: string | undefined;
        if (error === UserActionError.EmployeeReport) msg = error;
        else console.error(error);

        if (msg !== undefined)
          toast.show({
            description: msg,
            placement: 'top',
          });
        else genericToast();
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
        <Modal.Header>Report</Modal.Header>
        <Modal.Body>Are you sure you want to report this content?</Modal.Body>
        <Modal.Footer>
          <Button onPress={close} variant="unstyled" colorScheme="coolGray">
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            onPress={reportAndClose}
            colorScheme="danger"
          >
            Report
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default Reportable;
