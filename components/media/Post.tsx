import { Box, Skeleton, Text, useColorModeValue, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Post as PostObj } from '../../xplat/types/post';
import { User } from '../../xplat/types/user';
import UserTag from '../profile/UserTag';
import ImageCarousel from './ImageCarousel';

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

  // Author
  const [author, setAuthor] = useState<User | undefined>(undefined);

  // Video content

  // Image content
  const [imageUrls, setImageUrls] = useState<Array<string> | undefined>(
    undefined
  );

  // Text content
  const [textContent, setTextContent] = useState<string>('');

  useEffect(() => {
    const getData = async () => {
      if (post === undefined) return;

      await post.getData();

      post.getAuthor().then(setAuthor);
      post.getImageContentUrls().then(setImageUrls);
      post.getTextContent().then(setTextContent);
    };

    getData();
  }, [post]);

  const isTextContentLoaded = textContent !== '';

  return (
    <VStack w="full" alignItems="start" bg={baseBgColor}>
      <Box pl={2}>
        <UserTag user={author} />
      </Box>
      <Skeleton.Text p={2} lines={2} isLoaded={isTextContentLoaded}>
        <Box p={2}>
          <Text>{textContent}</Text>
        </Box>
      </Skeleton.Text>
      <VStack
        justifyContent="start"
        alignItems="start"
        w="full"
        space={2}
        pt={2}
      >
        <Skeleton w="full" h={40} isLoaded={isTextContentLoaded}>
          {imageUrls !== undefined ? (
            <ImageCarousel imageUrls={imageUrls} />
          ) : null}
        </Skeleton>
      </VStack>
    </VStack>
  );
};

export default Post;
