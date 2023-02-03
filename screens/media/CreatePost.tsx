import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Heading,
  Input,
  ScrollView,
  VStack,
  useColorModeValue,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../../App';
import Post from '../../components/media/Post';
import ActiveRoutesDropdown from '../../components/route/ActiveRoutesDropdown';
import { userAtom } from '../../utils/atoms';
import {
  FetchedRoute,
  buildRouteFetcherFromDocRefId,
} from '../../utils/queries';
import { TabGlobalScreenProps } from '../../utils/types';
import { DebounceSession } from '../../utils/utils';
import { createPost } from '../../xplat/api';
import { LazyStaticImage, LazyStaticVideo, PostMock } from '../../xplat/types';

/**
 * The CreatePost screen is responsible for handling post creation from
 * several entry points. The only difference between entry points is whether
 * or not the Route field is pre-loaded.
 */
const CreatePost = ({ route }: TabGlobalScreenProps<'CreatePost'>) => {
  const routeDocRefId = route.params.routeDocRefId;

  const navigation = useNavigation();
  const user = useRecoilValue(userAtom);

  const [textDebounceSession] = useState<DebounceSession>(
    new DebounceSession(250)
  );
  const [textContent, setTextContent] = useState<string>('');
  const [videoContent, setVideoContent] = useState<LazyStaticVideo>();
  const [isPickingVideo, setIsPickingVideo] = useState<boolean>(false);
  const [imageContent, setImageContent] = useState<LazyStaticImage[]>([]);
  const [isPickingImages, setIsPickingImages] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<FetchedRoute>();
  const [isProcessingPost, setIsProcessingPost] = useState<boolean>(false);
  const [previewPost, setPreviewPost] = useState<PostMock>();

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { data } = useQuery(
    routeDocRefId!,
    buildRouteFetcherFromDocRefId(routeDocRefId!),
    {
      enabled: routeDocRefId !== undefined,
    }
  );

  useEffect(() => {
    if (data && selectedRoute === undefined) setSelectedRoute(data);
  }, [data, selectedRoute]);

  // Build the preview post whenever relevant state changes
  useEffect(() => {
    if (user === undefined) return;
    setPreviewPost(
      new PostMock(
        user,
        new Date(Date.now()),
        textContent,
        [],
        imageContent,
        videoContent
      )
    );
  }, [textContent, videoContent, imageContent, user]);

  // Opens up a video picker and updates state
  const pickVideo = async () => {
    try {
      setIsPickingVideo(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) return;

      // Get the first frame as a thumbnail
      const thumbnailResult = await VideoThumbnails.getThumbnailAsync(
        result.uri
      );

      setVideoContent(
        new LazyStaticVideo(
          'mock/path',
          'mock/path',
          thumbnailResult.uri,
          result.uri
        )
      );
    } finally {
      setIsPickingVideo(false);
    }
  };

  // Opens up an image picker and update state
  const pickImages = async () => {
    try {
      setIsPickingImages(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
      });

      if (result.cancelled) return;

      setImageContent(
        result.selected.map(
          (info) => new LazyStaticImage('mock/path', info.uri)
        )
      );
    } finally {
      setIsPickingImages(false);
    }
  };

  // Builds the blobs and sends it to the backend
  const post = async () => {
    if (user === undefined) return;

    try {
      setIsProcessingPost(true);

      const videoBlob =
        videoContent !== undefined
          ? {
              video: await (await fetch(videoContent.videoUrl!)).blob(),
              thumbnail: await (await fetch(videoContent.thumbnailUrl!)).blob(),
            }
          : undefined;

      const imageBlobs = await Promise.all(
        imageContent.map(async (image) => (await fetch(image.imageUrl!)).blob())
      );

      const forum = selectedRoute?.forum;
      createPost(user, textContent, forum, imageBlobs, videoBlob).then(() => {
        queryClient.invalidateQueries({ queryKey: ['posts', user.getId()] });
        if (forum)
          queryClient.invalidateQueries({ queryKey: ['posts', forum.getId()] });
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingPost(false);
      // Leave the "Posting" screen
      navigation.goBack();
      navigation.navigate('Tabs', {
        screen: 'ProfileTab',
        params: {
          screen: 'Profile',
          params: {},
        },
      });
    }
  };

  const hasVideo = videoContent !== undefined;
  const hasImages = imageContent.length > 0;
  const isPostable = textContent !== '';

  return (
    <Box minH="full" bg={baseBgColor}>
      <ScrollView>
        <VStack py={2}>
          <FormControl mb={2} px={2}>
            <HStack flexBasis={0}>
              {hasVideo ? (
                <Button
                  onPress={() => setVideoContent(undefined)}
                  flexGrow={1}
                  mr={1}
                  variant="outline"
                >
                  Clear video
                </Button>
              ) : (
                <Button
                  onPress={pickVideo}
                  isLoading={isPickingVideo}
                  flexGrow={1}
                  mr={1}
                >
                  Select video
                </Button>
              )}

              {hasImages ? (
                <Button
                  onPress={() => setImageContent([])}
                  flexGrow={1}
                  ml={1}
                  variant="outline"
                >
                  Clear images
                </Button>
              ) : (
                <Button
                  onPress={pickImages}
                  isLoading={isPickingImages}
                  flexGrow={1}
                  ml={1}
                >
                  Select images
                </Button>
              )}
            </HStack>
          </FormControl>

          <FormControl px={2} pb={2}>
            <HStack>
              <FormControl.Label w={12} mr={2}>
                Body
              </FormControl.Label>
              <Box flexGrow={1}>
                <Input
                  multiline
                  placeholder="Find the right words"
                  onChangeText={(newText) =>
                    textDebounceSession.trigger(() => setTextContent(newText))
                  }
                />
              </Box>
            </HStack>
          </FormControl>

          <FormControl px={2} pb={2}>
            <HStack>
              <FormControl.Label w={12} mr={2}>
                Route
              </FormControl.Label>
              <Box flexGrow={1}>
                <ActiveRoutesDropdown
                  onSelectRoute={setSelectedRoute}
                  preSelectedRouteDocRefId={routeDocRefId}
                />
              </Box>
            </HStack>
          </FormControl>

          <Button
            mx={2}
            onPress={post}
            isLoading={isProcessingPost}
            isDisabled={!isPostable}
          >
            Post it!
          </Button>
        </VStack>
      </ScrollView>

      <Box mt="auto" pb={2}>
        <Heading mt={4} px={2}>
          Post preview
        </Heading>
        <Divider my={2} px={2} />
        {previewPost !== undefined ? <Post post={previewPost} /> : null}
      </Box>
    </Box>
  );
};

export default CreatePost;
