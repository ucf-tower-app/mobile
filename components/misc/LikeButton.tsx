import { Flex, Icon, Text } from 'native-base';
import { useEffect, useState } from 'react';
import IconToggle from './IconToggle';
import { Ionicons } from '@expo/vector-icons';
import { DebounceSession } from '../../utils/utils';

type Props = {
  isLiked: boolean;
  onSetLiked: (isLiked: boolean) => void;
  numLikes: number;
};
const LikeButton = ({ isLiked, onSetLiked, numLikes }: Props) => {
  const [isLikedLocal, setIsLikedLocal] = useState<boolean>(isLiked);
  const [numLikesLocal, setNumLikesLocal] = useState<number>(numLikes);
  const [debounceSession] = useState<DebounceSession>(
    new DebounceSession(1000)
  );

  useEffect(() => {
    setIsLikedLocal(isLiked);
    setNumLikesLocal(numLikes);
  }, [isLiked, numLikes]);

  const toggleIsLikedLocal = () => {
    const newIsLikedLocal = !isLikedLocal;
    setIsLikedLocal(newIsLikedLocal);
    if (newIsLikedLocal) {
      setNumLikesLocal(numLikesLocal + 1);
    } else {
      setNumLikesLocal(numLikesLocal - 1);
    }

    debounceSession.trigger(() => onSetLiked(newIsLikedLocal));
  };

  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="center">
      <Text mr={1}>{numLikesLocal}</Text>
      <IconToggle
        status={isLikedLocal}
        onToggle={toggleIsLikedLocal}
        onIcon={<Icon as={Ionicons} name="heart" size={5} color="red.500" />}
        offIcon={
          <Icon as={Ionicons} name="heart-outline" size={5} color="black" />
        }
      />
    </Flex>
  );
};

export default LikeButton;
