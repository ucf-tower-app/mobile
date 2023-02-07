import { VStack, HStack, Text } from 'native-base';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { buildCommentFetcher } from '../../utils/queries';
import { Comment as CommentObj } from '../../xplat/types';
import LikeButton from '../misc/LikeButton';
import UserTag from '../profile/UserTag';

const CommentSkeleton = () => {
  return null;
};

type Props = {
  comment: CommentObj;
};
const Comment = ({ comment }: Props) => {
  const user = useRecoilValue(userAtom);

  const { isLoading, isError, data, error } = useQuery(
    comment.getId(),
    buildCommentFetcher(comment)
  );

  if (isLoading) return <CommentSkeleton />;

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const onSetIsLiked = (isLiked: boolean) => {
    if (user === undefined) return;

    if (isLiked) data.commentObject.addLike(user);
    else data.commentObject.removeLike(user);
  };

  return (
    <VStack w="full" p={2} alignItems="flex-start">
      <HStack w="full" justifyContent="space-between">
        <UserTag user={data.author} size="sm" />
        <LikeButton likes={data.likes} onSetIsLiked={onSetIsLiked} />
      </HStack>
      <Text my={2}>{data.textContent}</Text>
    </VStack>
  );
};

export default Comment;
