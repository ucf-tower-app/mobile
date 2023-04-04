import {
  Box,
  HStack,
  Skeleton,
  Text,
  VStack,
  useColorModeValue,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { permissionLevelCanWrite } from '../../utils/permissions';
import { Comment as CommentObj, UserStatus } from '../../xplat/types';
import LikeButton from '../misc/LikeButton';
import UserTag, { UserTagSkeleton } from '../profile/UserTag';
import ContextMenu, { ContextOptions } from './ContextMenu';
import ActionedMedia from './actions/ActionedMedia';
import Deletable from './actions/Deletable';
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

type Props = {
  comment: CommentObj;
};
const Comment = ({ comment }: Props) => {
  const signedInUser = useRecoilValue(userAtom);
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);
  const [contextOptions, setContextOptions] = useState<ContextOptions>({});
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { isLoading, isError, data } = useQuery(
    comment.getId(),
    comment.buildFetcher()
  );
  const [authorStatus, setAuthorStatus] = useState<UserStatus>();

  useEffect(() => {
    if (data === undefined) return;
    data.author.getStatus().then(setAuthorStatus);
  }, [data]);

  // Prep the context options for this item
  useEffect(() => {
    if (
      signedInUser === undefined ||
      userPermissionLevel === undefined ||
      data === undefined ||
      authorStatus === undefined
    )
      return;

    const signedInUserOwnsComment =
      signedInUser.getId() === data.author.getId();

    const _contextOptions: ContextOptions = {};

    // If we're an employee or own the comment, allow deletion
    if (permissionLevelCanWrite(userPermissionLevel)) {
      if (userPermissionLevel >= UserStatus.Employee || signedInUserOwnsComment)
        _contextOptions.Delete = () => {
          setIsDeleting(true);
        };

      // If we don't own it, and the poster is not an emplyee, allow reporting
      if (!signedInUserOwnsComment && authorStatus < UserStatus.Employee)
        _contextOptions.Report = () => {
          setIsReporting(true);
        };
    }

    setContextOptions(_contextOptions);
  }, [signedInUser, userPermissionLevel, data, authorStatus]);

  if (isLoading) return <CommentSkeleton />;

  if (isError || data === undefined) return null;

  if (data.shouldBeHidden) return <ActionedMedia action="hidden" />;
  if (!data.commentObject.exists) return <ActionedMedia action="deleted" />;

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
      <Deletable
        isConfirming={isDeleting}
        media={data.commentObject}
        close={() => {
          setIsDeleting(false);
        }}
      />
      <VStack w="full" p={2} alignItems="flex-start">
        <HStack w="full" justifyContent="space-between">
          <UserTag
            userDocRefId={data.author.getId()}
            size="sm"
            timestamp={data.timestamp}
          />
          <ContextMenu contextOptions={contextOptions} />
        </HStack>
        <HStack w="full" justifyContent="space-between">
          <Text mt={2}>{data.textContent}</Text>
          {permissionLevelCanWrite(userPermissionLevel) ? (
            <LikeButton likes={data.likes} onSetIsLiked={onSetIsLiked} />
          ) : null}
        </HStack>
      </VStack>
    </>
  );
};

export default Comment;
