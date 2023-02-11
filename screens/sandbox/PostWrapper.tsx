import { Divider, ScrollView, useColorModeValue, VStack } from 'native-base';
import Post from '../../components/media/Post';
import { postMock, postMockNoImage, postMockNoVideo } from '../../utils/mocks';

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
      <Divider mb={4} />
      <Post post={postMock} context="Mock" />
      {padifyPost(<Post post={postMockNoVideo} context="Mock" />)}
      {padifyPost(<Post post={postMockNoImage} context="Mock" />)}
      <Divider mt={4} />
    </ScrollView>
  );
};

export default PostWrapper;
