import { Button, FormControl, Input, VStack } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';

const CreatePost = () => {
  const user = useRecoilValue(userAtom);
  const [textContent, setTextContent] = useState<string>('');
  const [videoContent, setVideoContent] = useState<Blob | undefined>(undefined);
  const [imageContent, setImageContent] = useState<Blob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const verifyAndPost = async () => { };

  const isPostable =
    textContent !== '' ||
    imageContent.length !== 0 ||
    videoContent !== undefined;
  return (
    <VStack p={2}>
      <FormControl>
        <FormControl.Label _text={{ bold: true }}>Body</FormControl.Label>
        <Input
          multiline
          placeholder="Say whats on your mind, or leave empty if your media speaks for itself!"
          onChangeText={setTextContent}
        />
      </FormControl>
      <Button
        onPress={verifyAndPost}
        isLoading={isLoading}
        isDisabled={isPostable}
        mt={2}
      >
        Post
      </Button>
    </VStack>
  );
};

export default CreatePost;
