import { VStack, HStack, Text } from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { permissionLevelCanWrite } from '../../utils/permissions';
import { buildCommentFetcher } from '../../utils/queries';
import { Comment as CommentObj } from '../../xplat/types';
import LikeButton from '../misc/LikeButton';
import UserTag from '../profile/UserTag';
import ContextMenu, { ContextOptions } from './ContextMenu';
import Reportable from './Reportable';

const CommentSkeleton = () => {
  return null;
};

type Props = {
  comment: CommentObj;
};
const Comment = ({ comment }: Props) => {
  const signedInUser = useRecoilValue(userAtom);
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);
  const [contextOptions, setContextOptions] = useState<ContextOptions>({});
  const [isReporting, setIsReporting] = useState<boolean>(false);

  const { isLoading, isError, data, error } = useQuery(
    comment.getId(),
    buildCommentFetcher(comment)
  );

  useEffect(() => {
    const _contextOptions: ContextOptions = {};
    if (
      signedInUser !== undefined &&
      signedInUser?.getId() !== data?.author.getId()
    )
      _contextOptions.Report = () => {
        setIsReporting(true);
      };
    setContextOptions(_contextOptions);
  }, [signedInUser, data, setContextOptions]);

  if (isLoading) return <CommentSkeleton />;

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const onSetIsLiked = (isLiked: boolean) => {
    if (signedInUser === undefined) return;

    if (isLiked) data.commentObject.addLike(signedInUser);
    else data.commentObject.removeLike(signedInUser);
  };

  return (
    <Reportable
      isConfirming={isReporting}
      media={data.commentObject}
      close={() => {
        setIsReporting(false);
      }}
    >
      <VStack w="full" p={2} alignItems="flex-start">
        <HStack w="full" justifyContent="space-between">
          <UserTag user={data.author} size="sm" timestamp={data.timestamp} />
          <ContextMenu contextOptions={contextOptions} />
        </HStack>
        <HStack w="full" justifyContent="space-between">
          <Text my={2}>{data.textContent}</Text>
          {permissionLevelCanWrite(userPermissionLevel) ? (
            <LikeButton likes={data.likes} onSetIsLiked={onSetIsLiked} />
          ) : null}
        </HStack>
      </VStack>
    </Reportable>
  );
};

export default Comment;
