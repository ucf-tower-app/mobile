import { Input, Pressable, Icon } from 'native-base';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';

const SearchBar = () => {
  const [inputText, setInputText] = useState('');

  const handleInput = (input: string) => {
    setInputText(input);
  };

  return (
    <Input
      size="md"
      variant="rounded"
      onChangeText={handleInput}
      value={inputText}
      InputRightElement={
        <Pressable onPress={() => setInputText('')}>
          <Icon as={<Feather name="x" />} size="md" color="black" mr="4" />
        </Pressable>
      }
      InputLeftElement={
        <Icon as={<Feather name="search" />} size="md" color="black" ml="4" />
      }
      focusOutlineColor="purple.500"
      backgroundColor="white"
    />
  );
};

export default SearchBar;
