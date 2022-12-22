import { Divider, ScrollView, useColorModeValue, VStack } from 'native-base';
import Post from '../../components/media/Post';
import { postMock, postMockNoImage } from '../../utils/mocks';

const padifyPost = (post: JSX.Element) => {
  return (
    <VStack>
      <Divider my={4} />
      {post}
    </VStack>
  );
};

const PostWrapper = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <ScrollView w="full" bg={baseBgColor}>
      <Post post={postMock} />
      {padifyPost(<Post post={postMockNoImage} />)}
      {padifyPost(<Post post={undefined} />)}
    </ScrollView>
  );
};

export default PostWrapper;
