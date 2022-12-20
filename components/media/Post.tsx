import { Box, Skeleton, Text, useColorModeValue, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Post as PostObj } from '../../xplat/types/post';
import { User } from '../../xplat/types/user';
import UserTag from '../profile/UserTag';

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
      post.hasImageContent().then((hasImageContent) => {
        if (!hasImageContent) return;
        post.getImageContentUrl().then((url) => setImageUrls([url!]));
      });
      post.getTextContent().then(setTextContent);
    };

    getData();
  }, [post]);

  const isTextContentLoaded = textContent !== '';

  return (
    <VStack w="full" alignItems="start" bg={baseBgColor} p={2}>
      <UserTag user={author} />
      <Box w="full" px={4} pt={2}>
        <Skeleton.Text lines={2} isLoaded={isTextContentLoaded}>
          <Text>{textContent}</Text>
        </Skeleton.Text>
      </Box>
    </VStack>
  );
};

export default Post;
