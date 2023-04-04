import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Button,
  HStack,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { permissionLevelCanWrite } from '../../utils/permissions';
import { TabGlobalNavigationProp } from '../../utils/types';
import { FetchedPost, Post as PostObj, UserStatus } from '../../xplat/types';
import LikeButton from '../misc/LikeButton';
import UserTag, { UserTagSkeleton } from '../profile/UserTag';
import RouteLink from '../route/RouteLink';
import LightDarkIcon from '../util/LightDarkIcon';
import ActionedMedia from './actions/ActionedMedia';
import Deletable from './actions/Deletable';
import Reportable from './actions/Reportable';
import ContextMenu, { ContextOptions } from './ContextMenu';
import { MediaType } from './Media';
import MediaCarousel from './MediaCarousel';
import Timestamp from './Timestamp';

export const PostSkeleton = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <VStack w="full" alignItems="flex-start" bg={baseBgColor}>
      <Box pl={2}>
        <UserTagSkeleton />
      </Box>
      <Skeleton.Text p={2} w="95%" lines={2} />
      <Skeleton w="full" pt={2} h={40} />
    </VStack>
  );
};

/**
 * A Post is a modular component that displays all relevant information about a user's post
 *
 * Posts can have the following information
 *  1. Text content
 *  2. Image content (multiple images)
 *  3. Video content
 *
 * Text content is required, and is also the minimum required content loaded
 * in order to render the actual post rather than its skeleton
 */
type Props = {
  post: PostObj;
  isInRouteView?: boolean;
  isPreview?: boolean;
};
const Post = ({ post, isInRouteView = false, isPreview = false }: Props) => {
  const navigation = useNavigation<TabGlobalNavigationProp>();

  const signedInUser = useRecoilValue(userAtom);
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);
  const [contextOptions, setContextOptions] = useState<ContextOptions>({});
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [mediaList, setMediaList] = useState<MediaType[] | undefined>(
    undefined
  );

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const [postData, setPostData] = useState<FetchedPost>();
  const [routeName, setRouteName] = useState<string>();

  const realQR = useQuery(post.getId(), post.buildFetcher(), {
    enabled: !post.isMock(),
  });
  const [authorStatus, setAuthorStatus] = useState<UserStatus>();

  useEffect(() => {
    if (realQR.data === undefined) return;
    realQR.data.author.getStatus().then(setAuthorStatus);
  }, [realQR.data]);

  // Set up the context menu
  useEffect(() => {
    if (
      signedInUser === undefined ||
      userPermissionLevel === undefined ||
      postData === undefined ||
      authorStatus === undefined
    )
      return;

    const signedInUserOwnsPost =
      signedInUser.getId() === postData.author.getId();

    const _contextOptions: ContextOptions = {};

    // If we're an employee or own the post, allow deletion
    if (permissionLevelCanWrite(userPermissionLevel)) {
      if (userPermissionLevel >= UserStatus.Employee || signedInUserOwnsPost)
        _contextOptions.Delete = () => {
          setIsDeleting(true);
        };

      // If we don't own it, and the poster is not an emplyee, allow reporting
      if (!signedInUserOwnsPost && authorStatus < UserStatus.Employee)
        _contextOptions.Report = () => {
          setIsReporting(true);
        };
    }

    setContextOptions(_contextOptions);
  }, [signedInUser, userPermissionLevel, postData, authorStatus]);

  useEffect(() => {
    if (realQR.data !== undefined) {
      setPostData(realQR.data);
      if (realQR.data.routeInfo !== undefined) {
        setRouteName(realQR.data.routeInfo.name);
      }
    }
  }, [realQR.data]);

  useEffect(() => {
    if (post.isMock()) {
      post.fetch().then(setPostData);
    }
  }, [post]);

  useEffect(() => {
    if (postData === undefined) return;
    const newMediaList: MediaType[] = [];
    if (postData.videoContent !== undefined) {
      newMediaList.push({
        videoUrl: postData.videoContent.videoUrl,
        imageUrl: postData.videoContent.thumbnailUrl,
      });
    }
    postData.imageContentUrls.forEach((url) =>
      newMediaList.push({ imageUrl: url })
    );
    setMediaList(newMediaList);
  }, [postData]);

  // Like the post
  const onSetIsLiked = (isLiked: boolean) => {
    if (signedInUser === undefined || postData === undefined) return;

    if (isLiked) postData.postObject.addLike(signedInUser);
    else postData.postObject.removeLike(signedInUser);
  };

  if (post.isMock()) {
    if (postData === undefined) return <PostSkeleton />;
  } else {
    if (realQR.isError) return null;
    if (realQR.isLoading || postData === undefined) return <PostSkeleton />;
  }

  if (postData.shouldBeHidden) return <ActionedMedia action="hidden" />;
  if (!postData.postObject.exists) return <ActionedMedia action="deleted" />;

  if (postData.isSend) {
    return (
      <HStack w="full" justifyItems="center" bg={baseBgColor} px={1.5}>
        <Box pl={1.5} width="42%" justifyItems={'center'}>
          <UserTag
            userDocRefId={postData.author.getId()}
            mini
            isNavigationDisabled={isPreview}
          />
        </Box>
        <LightDarkIcon name="trending-up" size="lg" />
        {postData.routeInfo !== undefined && (
          <Box width="33%" pl={1}>
            <RouteLink noPadding routeName={postData.routeInfo.name} />
          </Box>
        )}
        <Box width="10%">
          <Timestamp mini relative date={postData.timestamp} />
        </Box>

        {!isPreview && permissionLevelCanWrite(userPermissionLevel) ? (
          <Box ml="auto">
            <LikeButton likes={postData.likes} onSetIsLiked={onSetIsLiked} />
          </Box>
        ) : null}
      </HStack>
    );
  }

  const showRouteLink = !isInRouteView && routeName !== undefined;
  return (
    <>
      <Reportable
        isConfirming={isReporting}
        media={postData.postObject}
        close={() => {
          setIsReporting(false);
        }}
      />
      <Deletable
        isConfirming={isDeleting}
        media={postData.postObject}
        close={() => {
          setIsDeleting(false);
        }}
      />
      <VStack w="full" alignItems="flex-start" bg={baseBgColor}>
        <HStack
          w="full"
          px={2}
          justifyContent="space-between"
          mb={showRouteLink ? 0 : 2}
        >
          <UserTag
            userDocRefId={postData.author.getId()}
            timestamp={postData.timestamp}
            isNavigationDisabled={isPreview}
          />
          <ContextMenu contextOptions={contextOptions} />
        </HStack>
        {showRouteLink ? (
          <Box mb={2}>
            <RouteLink routeName={routeName} />
          </Box>
        ) : null}
        <Box p={isPreview ? 1 : 2} pt={0}>
          <Text>{postData.textContent}</Text>
        </Box>
        {mediaList === undefined ? null : (
          <Box w="full" pt={isPreview ? 0 : 2}>
            <MediaCarousel mediaList={mediaList} preview={isPreview} />
          </Box>
        )}
        {!isPreview ? (
          <HStack
            w="full"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Button
              variant="link"
              onPress={() =>
                navigation.push('Comments', {
                  postDocRefId: postData.postObject.getId(),
                })
              }
            >
              Comments
            </Button>
            {permissionLevelCanWrite(userPermissionLevel) ? (
              <Box position="absolute" right={2}>
                <LikeButton
                  likes={postData.likes}
                  onSetIsLiked={onSetIsLiked}
                />
              </Box>
            ) : null}
          </HStack>
        ) : null}
      </VStack>
    </>
  );
};

export default Post;
