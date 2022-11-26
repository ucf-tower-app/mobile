import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, HStack, Center, Box, Pressable, VStack, SearchIcon, ThreeDotsIcon, Flex } from 'native-base';
import { PropMap } from '../../utils/routes/routes';
import { useRef, useState } from 'react';
import { ScrollView } from 'react-native'

type Props = NativeStackScreenProps<PropMap, 'Navbar'>;


const Navbar = ({ route }: Props) => {
    const scrollRef = useRef<ScrollView>(null);
    const [selected, setSelected] = useState(0);
    const navBarTitles = ['All', 'Following', 'Leaderboards', 'Lost and Found', 'Routes'];

    const handlePress = (index: number) => {
        setSelected(index);
        if (index === 3) {
            scrollRef.current?.scrollToEnd();
        } else if (index === 0 || index === 1) {
            scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }
    }

    return (
        <VStack bg="white" pb="2" shadow="2">
            <Flex direction="row" p="2">
                <Box w="80%">
                    <Text fontSize="xl" bold>
                        {navBarTitles[selected]}
                    </Text>
                </Box>
                <Box w="20%" justifyContent="center">
                    <HStack justifyContent="space-around">
                        <Pressable onPress={() => setSelected(4)}>
                            <Center>
                                <SearchIcon size="md" />
                            </Center>
                        </Pressable>
                        <Center>
                            <ThreeDotsIcon size="md" />
                        </Center>
                    </HStack>
                </Box>
            </Flex>
            <ScrollView ref={scrollRef} horizontal={true} showsHorizontalScrollIndicator={false}>
                <HStack bg="white" shadow={6}>
                    <Pressable p="2" flex={1} onPress={() => handlePress(0)}>
                        <Box rounded="lg" px="3" bg={selected === 0 ? "purple.500" : "white"}>
                            <Center>
                                <Text color={selected === 0 ? "muted.50" : "black"}>
                                    All
                                </Text>
                            </Center>
                        </Box>
                    </Pressable>
                    <Pressable p="2" flex={1} onPress={() => handlePress(1)}>
                        <Box rounded="lg" px="3" bg={selected === 1 ? "purple.500" : "white"}>
                            <Center>
                                <Text color={selected === 1 ? "muted.50" : "black"}>
                                    Following
                                </Text>
                            </Center>
                        </Box>
                    </Pressable>
                    <Pressable p="2" flex={1} onPress={() => handlePress(2)}>
                        <Box rounded="lg" px="3" bg={selected === 2 ? "purple.500" : "white"}>
                            <Center>
                                <Text color={selected === 2 ? "muted.50" : "black"}>
                                    Leaderboards
                                </Text>
                            </Center>
                        </Box>
                    </Pressable>
                    <Pressable p="2" flex={1} onPress={() => handlePress(3)}>
                        <Box rounded="lg" px="3" bg={selected === 3 ? "purple.500" : "white"}>
                            <Center>
                                <Text color={selected === 3 ? "muted.50" : "black"}>
                                    Lost And Found
                                </Text>
                            </Center>
                        </Box>
                    </Pressable>
                </HStack>
            </ScrollView>
        </VStack >
    );
};

export default Navbar;