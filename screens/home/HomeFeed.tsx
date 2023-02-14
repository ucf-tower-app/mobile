import { Button, Center, FlatList, Text } from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import Post from '../../components/media/Post';
import { userAtom } from '../../utils/atoms';
import { getQueryCursor } from '../../xplat/queries/feed';
import { PostCursorMerger, Post as PostObj } from '../../xplat/types';

const HomeFeed = () => {
  const signedInUser = useRecoilValue(userAtom);
  const userQuery = useQuery(
    signedInUser !== undefined ? signedInUser.getId() : 'nullQuery',
    signedInUser === undefined ? () => undefined : signedInUser.buildFetcher(),
    { enabled: signedInUser !== undefined }
  );
  const [enabled, setEnabled] = useState<boolean>(
    process.env.NODE_ENV !== 'development'
  );
  const [cursor, setCursor] = useState<PostCursorMerger>();
  const [posts, setPosts] = useState<PostObj[]>([]);

  useEffect(() => {
    if (enabled && signedInUser !== undefined && userQuery.data !== undefined) {
      console.log("Ok let's get it goin!");
      const newCursor = getQueryCursor(userQuery.data.followingList);
      console.log('Got a cursor');
      setCursor(newCursor);
    }
  }, [enabled, signedInUser, userQuery.data]);

  const getPost = async () => {
    if (cursor === undefined) {
      console.log('No more posts');
      return;
    }
    if (await cursor.hasNext()) {
      const nxt = await cursor.pollNext();
      const nxtPosts = [...posts, nxt];
      setPosts(nxtPosts);
      console.log(nxtPosts.map((post) => post.getId()));
      console.log('Got nxt!', nxt.getId());
    } else {
      console.log('So sad');
    }
  };

  return (
    <>
      <Center>
        {enabled ? null : (
          <Button onPress={() => setEnabled(true)}>Enable</Button>
        )}
        <Text>Welcome Home!</Text>
        <Button onPress={getPost}>Get 'Em!</Button>
      </Center>
      <FlatList data={posts} renderItem={({ item }) => <Post post={item} />} />
    </>
  );
};

export default HomeFeed;
