import { ResizeMode, Video } from 'expo-av';
import { Flex, Box, Spinner } from 'native-base';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import VideoThumbnail from './VideoThumbnail';

type Props = {
  thumbnailUrl: string;
  videoUrl: string;
  width: number;
  height: number;
};
const VideoWithThumbnail = ({
  thumbnailUrl,
  videoUrl,
  width,
  height,
}: Props) => {
  const [tappedThumbnail, setTappedThumbnail] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return tappedThumbnail ? (
    <Flex w={width} h={height} justifyContent="center" alignItems="center">
      <Video
        resizeMode={ResizeMode.COVER}
        source={{ uri: videoUrl }}
        useNativeControls
        isLooping
        shouldPlay
        style={styles.video}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading ? (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="lg" />
        </Box>
      ) : null}
    </Flex>
  ) : (
    <VideoThumbnail
      thumbnailUrl={thumbnailUrl}
      onPress={() => {
        setTappedThumbnail(true);
        setIsLoading(true);
      }}
      width={width}
      height={height}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

export default VideoWithThumbnail;
