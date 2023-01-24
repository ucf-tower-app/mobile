import { ScrollView, VStack, Center, Divider } from 'native-base';
import { Post as PostObj } from '../../xplat/types/post';
import Post from './Post';

type Props = {
  posts: PostObj[] | undefined;
};
const Feed = ({ posts }: Props) => {
  const padifyPost = (post: JSX.Element) => {
    return (
      <VStack>
        {post}
        <Divider my={4} />
      </VStack>
    );
  };

  return (
    <ScrollView>
      <Center>
        <Divider />
        <VStack pt="4">
          {posts?.forEach((post) => {
            padifyPost(<Post post={post} />);
          })}
        </VStack>
      </Center>
    </ScrollView>
  );
};

export default Feed;
