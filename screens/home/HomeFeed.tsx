import {
  Button,
  Center,
  Divider,
  FlatList,
  VStack,
  useColorModeValue,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import Post, { PostSkeleton } from '../../components/media/Post';
import { userAtom } from '../../utils/atoms';
import { getQueryCursor } from '../../xplat/queries/feed';
import { PostCursorMerger, Post as PostObj } from '../../xplat/types';

const STRIDE = 2;
const INITIAL_STRIDE = 5;

const HomeFeed = () => {
  const signedInUser = useRecoilValue(userAtom);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const userQuery = useQuery(
    signedInUser !== undefined ? signedInUser.getId() : 'nullQuery',
    signedInUser === undefined ? () => undefined : signedInUser.buildFetcher(),
    { enabled: signedInUser !== undefined }
  );
  const [enabled, setEnabled] = useState<boolean>(
    process.env.NODE_ENV !== 'development'
  );
  const [cursor, setCursor] = useState<PostCursorMerger>();
  const [exhausted, setExhausted] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostObj[]>([]);

  useEffect(() => {
    if (enabled && signedInUser !== undefined && userQuery.data !== undefined) {
      const newCursor = getQueryCursor(userQuery.data.followingList);
      setCursor(newCursor);
      setExhausted(false);
    }
  }, [enabled, signedInUser, userQuery.data]);

  const getNextPosts = useCallback(async () => {
    if (cursor === undefined) {
      setExhausted(true);
      return;
    }
    if (exhausted) return;

    const newPosts = [];
    const stride = posts.length === 0 ? INITIAL_STRIDE : STRIDE;
    while (newPosts.length < stride && (await cursor.hasNext())) {
      newPosts.push(await cursor.pollNext());
    }
    const hasNext = await cursor.hasNext();
    setExhausted(!hasNext);
    setPosts([...posts, ...newPosts]);
  }, [cursor, exhausted, posts]);

  useEffect(() => {
    if (cursor) getNextPosts();
  }, [cursor, getNextPosts]);

  const header = () => (
    <Center>
      {enabled ? null : (
        <Button onPress={() => setEnabled(true)}>Enable</Button>
      )}
    </Center>
  );

  const renderSpinner = () => {
    if (!exhausted)
      return (
        <VStack>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </VStack>
      );
    else return null;
  };

  return (
    <FlatList
      bgColor={baseBgColor}
      ListHeaderComponent={header}
      data={posts}
      extraData={cursor}
      onEndReached={getNextPosts}
      ItemSeparatorComponent={Divider}
      ListFooterComponent={renderSpinner}
      renderItem={({ item }) => (
        <Center>
          <Post post={item} />
        </Center>
      )}
      keyExtractor={(item) => item.getId()}
    />
  );
};

export default HomeFeed;
