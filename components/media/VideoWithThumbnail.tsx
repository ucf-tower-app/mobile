import { useState } from 'react';
import { View } from 'native-base';

// TODO: Replace with xplat video obj when available
type Props = {
  thumbnailUrl: string;
  videoUrl: string;
};
const VideoWithThumbnail = ({ thumbnailUrl, videoUrl }: Props) => {
  const [tappedThumbnail, setTappedThumbnail] = useState<boolean>(false);

  return <View />;
};

export default VideoWithThumbnail;
