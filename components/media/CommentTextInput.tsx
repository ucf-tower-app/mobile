import { HStack, Input, Button } from 'native-base';
import { useState } from 'react';
import { Keyboard } from 'react-native';

type Props = {
  onSubmitComment: (comment: string) => Promise<boolean>;
  isLoading: boolean;
};
const CommentTextInput = ({ onSubmitComment, isLoading }: Props) => {
  const [commentText, setCommentText] = useState<string>('');

  return (
    <HStack p={2} w="full">
      <Input
        placeholder="Say what's on your mind"
        value={commentText}
        onChangeText={setCommentText}
        flexGrow={1}
        mr={2}
      />
      <Button
        onPress={async () => {
          if (await onSubmitComment(commentText)) {
            setCommentText('');
            Keyboard.dismiss();
          }
        }}
        isDisabled={commentText === ''}
        isLoading={isLoading}
        minW={24}
        minH={10}
      >
        Comment
      </Button>
    </HStack>
  );
};

export default CommentTextInput;
