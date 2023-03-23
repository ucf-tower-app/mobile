import { useNavigation } from '@react-navigation/native';
import { ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Text,
  useColorModeValue,
  useToast,
  useToken,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../../App';
import Feed from '../../components/media/Feed';
import { PostSkeleton } from '../../components/media/Post';
import Timestamp from '../../components/media/Timestamp';
import LikeButton from '../../components/misc/LikeButton';
import UserTag, { UserTagSkeleton } from '../../components/profile/UserTag';
import RatingModal from '../../components/route/RatingModal';
import SendShareModal from '../../components/route/SendShareModal';
import { userAtom, userPermissionLevelAtom } from '../../utils/atoms';
import { useEarlyLoad, useGenericErrorToast } from '../../utils/hooks';
import { permissionLevelCanWrite } from '../../utils/permissions';
import {
  TabGlobalNavigationProp,
  TabGlobalScreenProps,
} from '../../utils/types';
import { createPost, CreatePostError, getForumById } from '../../xplat/api';
import {
  getRQKey_MonthlyLeaderboard,
  getRQKey_SemesterLeaderboard,
} from '../../xplat/queries';
import { FetchedSend, Route, RouteStatus } from '../../xplat/types';

const FORCED_THUMBNAIL_HEIGHT = 200;

const LoadingRouteView = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <Center w="full" h="full" bg={baseBgColor}>
      <VStack w="full" h="full" justifyItems={'center'}>
        <Skeleton h="30%" />
        <Skeleton.Text p={4} />
        <HStack p={2}>
          <UserTagSkeleton />
        </HStack>
        <Center h="7%" mt={2} mb={2}>
          <Skeleton w="90%" h="100%" rounded={30} />
        </Center>
        <Center h="7%" mb={2}>
          <Skeleton w="90%" h="100%" rounded={30} />
        </Center>
        <Skeleton.Text h={'2%'} pr={'30%'} pl={'30%'} />
        <PostSkeleton />
      </VStack>
    </Center>
  );
};

const RouteView = ({ route }: TabGlobalScreenProps<'Route View'>) => {
  const isEarly = useEarlyLoad(100);
  const routeDocRefId = route.params.routeDocRefId;

  const navigation = useNavigation<TabGlobalNavigationProp>();

  const toast = useToast();
  const genericToast = useGenericErrorToast();
  const user = useRecoilValue(userAtom);
  const userPermissionLevel = useRecoilValue(userPermissionLevelAtom);

  const [isSending, setIsSending] = useState<boolean>(true);
  const [isRating, setIsRating] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const [fetchedSend, setFetchedSend] = useState<FetchedSend | undefined>(
    undefined
  );

  // Start as true so that the send button is disabled until the route is loaded

  const backgroundColorKey = useColorModeValue(
    'lightMode.base',
    'darkMode.base'
  );
  const backgroundColorHex = useToken('colors', backgroundColorKey);

  const { isLoading, isError, data, error } = useQuery(
    routeDocRefId,
    Route.buildFetcherFromDocRefId(routeDocRefId)
  );

  useEffect(() => {
    if (user === undefined || data === undefined) return;

    data.routeObject.getSendByUser(user).then((send) => {
      setIsSending(false);
      if (send !== undefined) send.fetch().then(setFetchedSend);
    });
  }, [data, user]);

  if (isLoading || isEarly) {
    return <LoadingRouteView />;
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  const onSetIsLiked = (isLiked: boolean) => {
    if (user === undefined) return;

    if (isLiked) data.routeObject.addLike(user);
    else data.routeObject.removeLike(user);
  };

  const sendIt = async (stars: number | undefined) => {
    if (data !== undefined && user !== undefined) {
      setIsRating(false);
      data.routeObject.FUCKINSENDIT(user, stars).then((send) => {
        setIsSending(false);
        setIsSharing(true);
        send.fetch().then(setFetchedSend);
        queryClient.invalidateQueries({
          queryKey: getRQKey_MonthlyLeaderboard(new Date()),
        });
        queryClient.invalidateQueries({
          queryKey: getRQKey_SemesterLeaderboard(new Date()),
        });
        queryClient.invalidateQueries({ queryKey: user.getId() });
      });
    }
  };

  const shareSend = async () => {
    if (data !== undefined && user !== undefined) {
      setIsSharing(false);
      try {
        await createPost({
          author: user,
          forum: getForumById(data.forumDocRefID),
          textContent: '',
          routeInfo: {
            name: data.name,
            grade: data.gradeDisplayString,
          },
          isSend: true,
        }).then(() => {
          queryClient.invalidateQueries({
            queryKey: ['posts', data.forumDocRefID],
          });
        });
      } catch (e: any) {
        var msg: string | undefined;
        if (e === CreatePostError.TooLarge) msg = e;
        else console.error(e);

        if (msg !== undefined)
          toast.show({
            description: msg,
            placement: 'top',
          });
        else genericToast();
      }
    }
  };

  const post = () => {
    navigation.push('Create Post', {
      routeDocRefId: data.routeObject.getId(),
    });
  };

  const routeViewComponent = () => (
    <Box w="full" bg={backgroundColorHex}>
      <ImageBackground
        style={styles.thumbnail}
        resizeMode={ResizeMode.COVER}
        source={{ uri: data.thumbnailUrl }}
      >
        <LinearGradient
          style={styles.gradient}
          colors={[backgroundColorHex + '00', backgroundColorHex]}
        />
        <Flex
          direction="column"
          h="full"
          w="full"
          bg={backgroundColorHex}
          pb="0"
        >
          <HStack flexWrap="wrap" justifyContent="space-between" mx={4}>
            <Heading size="2xl">{data.name}</Heading>
            <Heading size="2xl" color="grey">
              {data.gradeDisplayString}
            </Heading>
          </HStack>
          <Text fontSize="2xl" color="grey" mx={4}>
            {data.stringifiedTags}
          </Text>
          <HStack flexWrap="wrap" justifyContent="space-between" mx={4} mt={2}>
            {data.setter !== undefined ? (
              <VStack justifyContent="flex-start" flexGrow={0}>
                <Text fontSize="lg" color="grey" fontWeight="bold" mb={2}>
                  Setter
                </Text>
                <UserTag userDocRefId={data.setter.getId()} size="sm" />
              </VStack>
            ) : null}
          </HStack>
          <Text fontSize="lg" mx={4} mt={2}>
            {data.description}
          </Text>
          <HStack
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="flex-end"
            mx={4}
            mt={4}
          >
            <Box>
              <Text fontSize="lg" italic bold>
                {RouteStatus[data.status]}
              </Text>
              {data.rope !== undefined ? (
                <Text fontSize="md">Rope {data.rope}</Text>
              ) : null}
            </Box>
            {permissionLevelCanWrite(userPermissionLevel) ? (
              <LikeButton likes={data.likes} onSetIsLiked={onSetIsLiked} />
            ) : null}
          </HStack>
          {permissionLevelCanWrite(userPermissionLevel) &&
          data.status === RouteStatus.Active ? (
            <VStack>
              <Button
                mx={4}
                mt={4}
                onPress={() => {
                  if (data && user) setIsRating(true);
                }}
                isDisabled={fetchedSend !== undefined}
                isLoading={isSending}
                variant={fetchedSend === undefined ? 'solid' : 'outline'}
              >
                {fetchedSend !== undefined ? (
                  <Text>
                    Sent{' '}
                    <Timestamp
                      relative
                      date={fetchedSend.timestamp}
                      fontSize="sm"
                      color="gray"
                    />
                  </Text>
                ) : (
                  'Send it!'
                )}
              </Button>
              <Button mx={4} mt={4} onPress={post}>
                Post to this route
              </Button>
            </VStack>
          ) : null}
          <Center mt={4} mb={2}>
            <Heading>Posts</Heading>
          </Center>
          <Divider />
        </Flex>
      </ImageBackground>
    </Box>
  );

  return (
    <>
      <RatingModal
        isOpen={isRating}
        close={() => {
          setIsSending(false);
          setIsRating(false);
        }}
        onSubmit={sendIt}
      />
      {user && (
        <SendShareModal
          isOpen={isSharing}
          close={() => setIsSharing(false)}
          onShare={shareSend}
          routeInfo={{
            name: data.name,
            gradeDisplayString: data.gradeDisplayString,
          }}
        />
      )}
      <Feed
        forumDocRefId={data.forumDocRefID}
        topComponent={routeViewComponent}
        isInRouteView
      />
    </>
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    flex: 1,
    width: '100%',
    minHeight: FORCED_THUMBNAIL_HEIGHT,
  },
  gradient: {
    minHeight: FORCED_THUMBNAIL_HEIGHT,
  },
});

export default RouteView;
