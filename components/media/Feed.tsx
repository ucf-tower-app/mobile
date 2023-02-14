import {
  Divider,
  Box,
  FlatList,
  Spinner,
  useColorModeValue,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { constructPageData, getIQParams_UserPosts } from '../../xplat/queries';
import { getIQParams_ForumPosts } from '../../xplat/queries/forum';
import { Post as PostObj } from '../../xplat/types';
import Post from './Post';

/**
 * A feed of posts. The callee can provide an optional component to place on top.
 * userDocRefId or forumDocRefId are required.
 */
type Props = {
  topComponent?: () => JSX.Element;
  userDocRefId?: string;
  forumDocRefId?: string;
  isInRouteView?: boolean;
};
const Feed = ({
  topComponent,
  userDocRefId = undefined,
  forumDocRefId = undefined,
  isInRouteView = false,
}: Props) => {
  const [posts, setPosts] = useState<PostObj[]>([]);

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      userDocRefId !== undefined
        ? getIQParams_UserPosts(userDocRefId)
        : getIQParams_ForumPosts(forumDocRefId!)
    );

  useEffect(() => {
    if (data)
      setPosts(data.pages.flatMap((page) => constructPageData(PostObj, page)));
  }, [data]);

  const loadNextPosts = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderSpinner = () => {
    if (hasNextPage) return <Spinner size="lg" />;
    else return null;
  };

  return (
    <FlatList
      ListHeaderComponent={topComponent}
      data={posts}
      onEndReached={loadNextPosts}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderSpinner}
      ItemSeparatorComponent={Divider}
      bgColor={baseBgColor}
      keyExtractor={(item) => {
        return item.getId();
      }}
      renderItem={({ item }) => (
        <Box mt={4} mb={2}>
          <Post post={item} isInRouteView={isInRouteView} />
        </Box>
      )}
    />
  );
};

export default Feed;
