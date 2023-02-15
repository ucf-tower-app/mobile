import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Button,
  HStack,
  Icon,
  Skeleton,
  Text,
  VStack,
  useColorModeValue,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { permissionLevelCanWrite } from '../../utils/permissions';
import { TabGlobalNavigationProp } from '../../utils/types';
import { FetchedPost, Post as PostObj, Route } from '../../xplat/types';
import LikeButton from '../misc/LikeButton';
import UserTag, { UserTagSkeleton } from '../profile/UserTag';
import RouteLink from '../route/RouteLink';
import ContextMenu, { ContextOptions } from './ContextMenu';
import { MediaType } from './Media';
import MediaCarousel from './MediaCarousel';
import Reportable from './Reportable';
import Timestamp from './Timestamp';

const PostSkeleton = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <VStack w="full" alignItems="flex-start" bg={baseBgColor}>
      <Box pl={2}>
        <UserTagSkeleton />
      </Box>
      <Skeleton.Text p={2} lines={2} />
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

  const [mediaList, setMediaList] = useState<MediaType[] | undefined>(
    undefined
  );

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const [postData, setPostData] = useState<FetchedPost>();
  const [route, setRoute] = useState<Route>();

  const realQR = useQuery(post.getId(), post.buildFetcher(), {
    enabled: !post.isMock(),
  });

  // Set up the context menu
  useEffect(() => {
    const _contextOptions: ContextOptions = {};
    if (
      signedInUser !== undefined &&
      signedInUser?.getId() !== postData?.author.getId()
    )
      _contextOptions.Report = () => {
        setIsReporting(true);
      };
    setContextOptions(_contextOptions);
  }, [signedInUser, postData]);

  useEffect(() => {
    if (realQR.data !== undefined) {
      setPostData(realQR.data);

      const updateRoute = async () => {
        const _route = await (
          await realQR.data.postObject.getForum()
        )?.getRoute();
        setRoute(_route);
      };

      updateRoute();
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
  }, [post, postData]);

  // Like the post
  const onSetIsLiked = (isLiked: boolean) => {
    if (signedInUser === undefined || postData === undefined) return;

    if (isLiked) postData.postObject.addLike(signedInUser);
    else postData.postObject.removeLike(signedInUser);
  };

  if (post.isMock()) {
    if (postData === undefined) return <PostSkeleton />;
  } else {
    if (realQR.isError) {
      console.error(realQR.error);
      return null;
    }
    if (realQR.isLoading || postData === undefined) return <PostSkeleton />;
  }

  if (postData.isSend) {
    return (
      <HStack w="full" justifyItems="center" bg={baseBgColor} mb={2} px={2}>
        <Box pl={1.5} pr={1}>
          <UserTag
            user={postData.author}
            mini
            isNavigationDisabled={isPreview}
          />
        </Box>
        <Icon as={<Ionicons name="trending-up" />} color="black" size="lg" />
        {postData.routeInfo !== undefined && (
          <Text pl={1}>{postData.routeInfo.name}</Text> // TODO: Make this a link
        )}
        <Box pl={2}>
          <Timestamp relative date={postData.timestamp} />
        </Box>

        {!isPreview && permissionLevelCanWrite(userPermissionLevel) ? (
          <Box ml="auto">
            <LikeButton likes={postData.likes} onSetIsLiked={onSetIsLiked} />
          </Box>
        ) : null}
      </HStack>
    );
  }

  const showRouteLink = !isInRouteView && route !== undefined;
  return (
    <Reportable
      isConfirming={isReporting}
      media={postData.postObject}
      close={() => {
        setIsReporting(false);
      }}
    >
      <VStack w="full" alignItems="flex-start" bg={baseBgColor}>
        <HStack
          w="full"
          px={2}
          justifyContent="space-between"
          mb={showRouteLink ? 0 : 2}
        >
          <UserTag
            user={postData.author}
            timestamp={postData.timestamp}
            isNavigationDisabled={isPreview}
          />
          <ContextMenu contextOptions={contextOptions} />
        </HStack>
        {showRouteLink ? (
          <Box mb={2}>
            <RouteLink route={route!} />
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
    </Reportable>
  );
};

export default Post;
