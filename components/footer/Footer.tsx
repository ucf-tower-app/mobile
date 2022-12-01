import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HStack, Box, Pressable, Center, Text, Icon, View } from 'native-base';
import { useState } from 'react';
import { PropMap } from '../../utils/routes/routes';
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

type Props = NativeStackScreenProps<PropMap, 'Footer'>;
const Footer = () => {
    const [selected, setSelected] = useState(0);
    const Tab = createBottomTabNavigator();

    const Screen = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Screen!</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={({ }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = 'home';

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Likes') {
                        iconName = 'heart';
                    } else if (route.name === 'Search') {
                        iconName = 'search';
                    } else if (route.name === 'Profile') {
                        iconName = 'user';
                    }

                    // You can return any component that you like here!
                    <Icon as={<Feather />} size="sm" color={color} />

                    return;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
            })}>
                <Tab.Screen name="Home" component={Screen} />
                <Tab.Screen name="Likes" component={Screen} />
                <Tab.Screen name="Search" component={Screen} />
                <Tab.Screen name="Profile" component={Screen} />
            </Tab.Navigator>
        </NavigationContainer>

    );
};

export default Footer;