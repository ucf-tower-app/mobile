import { Button, Center, Divider, FlatList } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import Post, { PostSkeleton } from '../../components/media/Post';
import { userAtom } from '../../utils/atoms';
import { getQueryCursor } from '../../xplat/queries/feed';
import { PostCursorMerger, Post as PostObj } from '../../xplat/types';

const STRIDE = 2;

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
    console.log('Get more posts');
    if (cursor === undefined) {
      setExhausted(true);
      return;
    }
    if (exhausted) return;

    const newPosts = [];
    while (newPosts.length < STRIDE && (await cursor.hasNext())) {
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
    if (!exhausted) return <PostSkeleton />;
    else return null;
  };

  const renderDivider = () => <Divider />;

  return (
    <FlatList
      ListHeaderComponent={header}
      data={posts}
      extraData={cursor}
      onEndReached={getNextPosts}
      ItemSeparatorComponent={renderDivider}
      ListFooterComponent={renderSpinner}
      renderItem={({ item }) => <Post post={item} />}
    />
  );
};

export default HomeFeed;
