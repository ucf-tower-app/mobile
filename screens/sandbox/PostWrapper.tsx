import { Center } from 'native-base';
import Post from '../../components/media/Post';
import { postMock } from '../../utils/mocks';

const PostWrapper = () => {
  return (
    <Center>
      <Post post={postMock} />
    </Center>
  );
};

export default PostWrapper;
