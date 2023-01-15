import { ResizeMode } from 'expo-av';
import { Image } from 'native-base';
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
};
const Media = ({ media, width, height }: Props) => {
  return media.videoUrl === undefined ? (
    <Image
      w={width}
      h={height}
      resizeMode={ResizeMode.COVER}
      source={{ uri: media.imageUrl }}
      alt="Post image content"
    />
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
