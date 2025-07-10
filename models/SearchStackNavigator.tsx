import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchTab from '../tabs/SearchTab';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import AddPlantScreen from '../screens/AddPlantScreen';
import { Plant } from "./Plant";

export type SearchStackParamList = {
    SearchTab: undefined;
    AddPlantScreen: undefined;
    PlantDetailScreen: Plant;
}

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function HomeStackNavigator() {
    return (
        <Stack.Navigator initialRouteName="SearchTab">
            <Stack.Screen name="SearchTab" component={SearchTab} options={{ headerShown: false }} />
            <Stack.Screen name="PlantDetailScreen" component={PlantDetailScreen} options={{ title: 'Dettaglio Pianta' }} />
            <Stack.Screen name="AddPlantScreen" component={AddPlantScreen} options={{ title: 'Aggiungi Pianta' }} />
        </Stack.Navigator>
    );
}