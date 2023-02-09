import { Button, Center, Modal } from 'native-base';
import { useState } from 'react';
import StarRating from 'react-native-star-rating-widget';

type Props = {
  isOpen: boolean;
  close: () => void;
  onSubmit: (stars: number | undefined) => void;
};
const RatingModal = ({ isOpen, close, onSubmit }: Props) => {
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const [rating, setRating] = useState<number>();

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>
          Nice send! Please consider rating the route if you liked it!
        </Modal.Header>
        <Modal.Body>
          <Center>
            <StarRating
              enableHalfStar={false}
              rating={rating ?? 0}
              onChange={setRating}
              onRatingStart={() => setHasTouched(true)}
            />
          </Center>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={() => onSubmit(rating)}>
            {hasTouched ? 'Submit!' : 'No thanks.'}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default RatingModal;
