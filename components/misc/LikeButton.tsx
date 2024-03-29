import { Flex, Text } from 'native-base';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { DebounceSession } from '../../utils/utils';
import { User, containsRef } from '../../xplat/types';
import LightDarkIcon from '../util/LightDarkIcon';
import IconToggle from './IconToggle';

type Props = {
  likes: User[];
  onSetIsLiked: (isLiked: boolean) => void;
};
const LikeButton = ({ likes, onSetIsLiked }: Props) => {
  const user = useRecoilValue(userAtom);

  const [userIsInLikes, setUserIsInLikes] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [debounceSession] = useState<DebounceSession>(
    new DebounceSession(1000)
  );

  useEffect(() => {
    if (user === undefined) return;
    const _userIsInLikes = containsRef(likes, user) ?? false;
    setUserIsInLikes(_userIsInLikes);
    setIsLiked(_userIsInLikes);
  }, [likes, user]);

  const toggleIsLikedLocal = () => {
    const newIsLikedLocal = !isLiked;
    setIsLiked(newIsLikedLocal);
    debounceSession.trigger(() => onSetIsLiked(newIsLikedLocal));
  };

  let numLikes = likes.length;
  if (userIsInLikes && !isLiked) numLikes--;
  else if (!userIsInLikes && isLiked) numLikes++;
  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="center">
      <Text mr={1}>{numLikes}</Text>
      <IconToggle
        status={isLiked}
        onToggle={toggleIsLikedLocal}
        onIcon={<LightDarkIcon name="heart" size={5} color="red.500" />}
        offIcon={<LightDarkIcon name="heart-outline" size={5} />}
      />
    </Flex>
  );
};

export default LikeButton;
