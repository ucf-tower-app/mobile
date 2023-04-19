import { ResizeMode } from 'expo-av';
import { Image, Box, Spinner } from 'native-base';
import { useState } from 'react';
import VideoWithThumbnail from './VideoWithThumbnail';

// If videoURL is defined then it is a video
export type MediaType = {
  imageUrl: string;
  videoUrl?: string;
};
type Props = {
  media: MediaType;
  width: number;
  height: number;
  borderRadius?: number;
};
const Media = ({ media, width, height, borderRadius = 0 }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return media.videoUrl === undefined ? (
    <Box>
      <Image
        w={width}
        h={height}
        borderRadius={borderRadius}
        resizeMode={ResizeMode.COVER}
        source={{ uri: media.imageUrl }}
        onLoad={() => setIsLoading(false)}
        alt="Post image content"
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
    </Box>
  ) : (
    <VideoWithThumbnail
      thumbnailUrl={media.imageUrl}
      videoUrl={media.videoUrl}
      width={width}
      height={height}
    />
  );
};

export default Media;
