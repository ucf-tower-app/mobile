import { Box, Skeleton, Text, useColorModeValue, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Post as PostObj } from '../../xplat/types/post';
import { User } from '../../xplat/types/user';
import UserTag from '../profile/UserTag';
import { MediaType } from './Media';
import MediaCarousel from './MediaCarousel';

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
  post: PostObj | undefined;
};
const Post = ({ post }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const [author, setAuthor] = useState<User | undefined>(undefined);
  const [mediaList, setMediaList] = useState<MediaType[] | undefined>(
    undefined
  );
  const [textContent, setTextContent] = useState<string>('');

  useEffect(() => {
    const getData = async () => {
      if (post === undefined) return;
      await post.getData();

      post.getAuthor().then(setAuthor);
      post.getTextContent().then(setTextContent);

      const newMediaList: MediaType[] = [];
      if (await post.hasVideoContent()) {
        newMediaList.push({
          imageUrl: await post.getVideoThumbnailUrl(),
          videoUrl: await post.getVideoUrl(),
        });
      }
      (await post.getImageContentUrls()).forEach((url) =>
        newMediaList.push({ imageUrl: url })
      );
      setMediaList(newMediaList);
    };

    getData();
  }, [post]);

  const isTextContentLoaded = textContent !== '';
  const isMediaLoaded = mediaList !== undefined;

  if (author === undefined) return null;

  return (
    <VStack w="full" alignItems="flex-start" bg={baseBgColor}>
      <Box pl={2}>
        <UserTag user={author} />
      </Box>
      <Skeleton.Text p={2} lines={2} isLoaded={isTextContentLoaded}>
        <Box p={2}>
          <Text>{textContent}</Text>
        </Box>
      </Skeleton.Text>
      <Skeleton w="full" pt={2} h={40} isLoaded={isMediaLoaded}>
        {mediaList === undefined ? null : (
          <Box w="full" pt={2}>
            <MediaCarousel mediaList={mediaList} />
          </Box>
        )}
      </Skeleton>
    </VStack>
  );
};

export default Post;
