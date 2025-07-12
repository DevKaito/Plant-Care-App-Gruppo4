import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeTab from '../tabs/HomeTab';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import AddPlantScreen from '../screens/AddPlantScreen';
import { Plant } from "./Plant";

export type HomeStackParamList = {
    HomeTab: undefined;
    AddPlantScreen: undefined;
    PlantDetailScreen: Plant;
}

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
    return (
        <Stack.Navigator initialRouteName="HomeTab">
            <Stack.Screen name="HomeTab" component={HomeTab} options={{ headerShown: false }} />
            <Stack.Screen name="PlantDetailScreen" component={PlantDetailScreen} options={{ title: 'Plant Details' }} />
            <Stack.Screen name="AddPlantScreen" component={AddPlantScreen} options={{ title: 'Add Plant' }} />
        </Stack.Navigator>
    );
}