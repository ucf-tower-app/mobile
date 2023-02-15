import {
  VStack,
  HStack,
  Box,
  Text,
  useColorModeValue,
  Skeleton,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { permissionLevelCanWrite } from '../../utils/permissions';
import { buildCommentFetcher } from '../../utils/queries';
import { Comment as CommentObj } from '../../xplat/types';
import LikeButton from '../misc/LikeButton';
import UserTag, { UserTagSkeleton } from '../profile/UserTag';
import ContextMenu, { ContextOptions } from './ContextMenu';
import Reportable from './actions/Reportable';

const CommentSkeleton = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <VStack w="full" alignItems="flex-start" bg={baseBgColor}>
      <Box pl={2}>
        <UserTagSkeleton />
      </Box>
      <Skeleton.Text p={2} lines={2} />
    </VStack>
  );
};

const DeletedComment = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <Box w="full" bg={baseBgColor} pl={2}>
      <Text italic>This post has been removed</Text>
    </Box>
  );
};

type Props = {
  comment: CommentObj;
};
const Comment = ({ comment }: Props) => {
  const signedInUser = useRecoilValue(userAtom);
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);
  const [contextOptions, setContextOptions] = useState<ContextOptions>({});
  const [isReporting, setIsReporting] = useState<boolean>(false);

  const { isLoading, isError, data } = useQuery(
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

  if (isError || data === undefined) return null;

  if (!data.commentObject.exists) return <DeletedComment />;

  const onSetIsLiked = (isLiked: boolean) => {
    if (signedInUser === undefined) return;

    if (isLiked) data.commentObject.addLike(signedInUser);
    else data.commentObject.removeLike(signedInUser);
  };

  return (
    <>
      <Reportable
        isConfirming={isReporting}
        media={data.commentObject}
        close={() => {
          setIsReporting(false);
        }}
      />
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
    </>
  );
};

export default Comment;
