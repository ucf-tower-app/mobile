import { Input, Box, Pressable, useColorModeValue } from 'native-base';
import { useState } from 'react';
import { Keyboard } from 'react-native';
import { DebounceSession } from '../../utils/utils';
import LightDarkIcon from '../util/LightDarkIcon';

type QueryHandler = {
  onChangeQuery: (newQuery: string) => void;
  onChangeQueryDebounceSession?: DebounceSession;
};
type Props = {
  queryHandler?: QueryHandler;
};
const SearchBar = ({ queryHandler }: Props) => {
  const secondaryBgColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );

  const [inputText, setInputText] = useState('');

  const handleInput = (input: string) => {
    setInputText(input);

    // If the user wants to debounce, do it. Otherwise set immediately
    if (queryHandler !== undefined) {
      if (queryHandler.onChangeQueryDebounceSession) {
        queryHandler.onChangeQueryDebounceSession.trigger(() =>
          queryHandler.onChangeQuery(input)
        );
      } else {
        queryHandler.onChangeQuery(input);
      }
    }
  };

  return (
    <Input
      size="md"
      variant="rounded"
      onChangeText={handleInput}
      value={inputText}
      InputRightElement={
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            handleInput('');
          }}
        >
          <Box mr={2}>
            <LightDarkIcon name="close-outline" size="lg" />
          </Box>
        </Pressable>
      }
      InputLeftElement={
        <Box ml={3}>
          <LightDarkIcon name="search" size="md" />
        </Box>
      }
      focusOutlineColor={secondaryBgColor}
      autoCorrect={false}
      autoComplete="off"
    />
  );
};

export default SearchBar;
