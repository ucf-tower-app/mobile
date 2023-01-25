import { ScrollView, VStack, Center, Divider } from 'native-base';
import { useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { PostCursorMerger, QueryCursor } from '../../xplat/types/queryCursors';
import { Post as PostObj } from '../../xplat/types/types';
import Post from './Post';

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent) => {
  const paddingToBottom = 50;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

type Props = {
  postCursor: QueryCursor<PostObj> | PostCursorMerger;
};
const Feed = ({ postCursor }: Props) => {
  const [posts, setPosts] = useState<PostObj[]>([]);
  const [isOutOfPosts, setIsOutOfPosts] = useState<boolean>(false);

  useEffect(() => {
    const getFirstFivePosts = async () => {
      const newPosts: PostObj[] = [];
      while (newPosts.length < 5) {
        const newPost = await postCursor.pollNext();
        if (newPost === undefined) {
          setIsOutOfPosts(true);
          break;
        }
        newPosts.push(newPost);
      }
      setPosts(newPosts);
    };

    getFirstFivePosts();
  }, [postCursor]);

  const loadNextPost = async () => {
    if (isOutOfPosts) return;
    const newPosts = [...posts];
    const newPost = await postCursor.pollNext();
    if (newPost === undefined) {
      setIsOutOfPosts(true);
      return;
    }
    newPosts.push(newPost);
    setPosts(posts);
  };

  const padifyPost = (post: JSX.Element) => {
    return (
      <VStack>
        {post}
        <Divider my={4} />
      </VStack>
    );
  };

  return (
    <ScrollView
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          loadNextPost();
        }
      }}
    >
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
