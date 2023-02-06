import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Button,
  Center,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TabGlobalNavigationProp } from '../../utils/types';
import { FetchedPost, Post as PostObj } from '../../xplat/types';
import UserTag, { UserTagSkeleton } from '../profile/UserTag';
import { MediaType } from './Media';
import MediaCarousel from './MediaCarousel';

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
};
const Post = ({ post }: Props) => {
  const navigation = useNavigation<TabGlobalNavigationProp>();

  const [mediaList, setMediaList] = useState<MediaType[] | undefined>(
    undefined
  );

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const [postData, setPostData] = useState<FetchedPost>();

  const realQR = useQuery(post.getId(), post.buildFetcher(), {
    enabled: !post.isMock(),
  });

  useEffect(() => {
    if (realQR.data) setPostData(realQR.data);
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

  if (post.isMock()) {
    if (postData === undefined) return <PostSkeleton />;
  } else {
    if (realQR.isError) {
      console.error(realQR.error);
      return null;
    }
    if (realQR.isLoading || postData === undefined) return <PostSkeleton />;
  }

  return (
    <VStack w="full" alignItems="flex-start" bg={baseBgColor}>
      <Box pl={2}>
        <UserTag user={postData.author} />
      </Box>
      <Box p={2}>
        <Text>{postData.textContent}</Text>
      </Box>
      {mediaList === undefined ? null : (
        <Box w="full" pt={2}>
          <MediaCarousel mediaList={mediaList} />
        </Box>
      )}
      <Center w="full">
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
      </Center>
    </VStack>
  );
};

export default Post;
