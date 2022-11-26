import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HStack, Box, Pressable, Center, Text, SearchIcon, Icon } from 'native-base';
import { useState } from 'react';
import { PropMap } from '../../utils/routes/routes';
import { Feather, Octicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<PropMap, 'Footer'>;
const Footer = ({ }: Props) => {
    const [selected, setSelected] = useState(0);
    return (
        <Box flex={1} bg="white" safeAreaTop width="100%" maxW="300px" alignSelf="center">
            <HStack bg="white" alignItems="center" safeAreaBottom shadow={6}>
                <Pressable opacity={selected === 0 ? 1 : 0.4} py="3" flex={1} onPress={() => setSelected(0)}>
                    <Center>
                        <Icon as={<Feather name="home" />} size="sm" color="black" />
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 1 ? 1 : 0.4} py="2" flex={1} onPress={() => setSelected(1)}>
                    <Center>
                        <Icon as={<Feather name="heart" />} size="sm" color="black" />
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 2 ? 1 : 0.4} py="2" flex={1} onPress={() => setSelected(2)}>
                    <Center>
                        <SearchIcon color="black" size="sm" />
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 3 ? 1 : 0.4} py="2" flex={1} onPress={() => setSelected(3)}>
                    <Center>
                        <Icon as={<Octicons name="person" />} size="sm" color="black" />
                    </Center>
                </Pressable>
            </HStack>
        </Box>
    );
};

export default Footer;