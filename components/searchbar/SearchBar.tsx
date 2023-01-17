import { Feather } from '@expo/vector-icons';
import { Icon, Input, Pressable } from 'native-base';
import { useState } from 'react';
import { DebounceSession } from '../../utils/utils';

type QueryHandler = {
  onChangeQuery: (newQuery: string) => void;
  onChangeQueryDebounceSession?: DebounceSession;
};
type Props = {
  queryHandler?: QueryHandler;
};
const SearchBar = ({ queryHandler }: Props) => {
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
        <Pressable onPress={() => handleInput('')}>
          <Icon as={<Feather name="x" />} size="md" color="black" mr="4" />
        </Pressable>
      }
      InputLeftElement={
        <Icon as={<Feather name="search" />} size="md" color="black" ml="4" />
      }
      focusOutlineColor="purple.500"
      backgroundColor="white"
      autoCorrect={false}
      autoComplete="off"
    />
  );
};

export default SearchBar;
