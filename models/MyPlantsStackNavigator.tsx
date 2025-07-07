// navigation/MyPlantsStackNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyPlantsTab from '../tabs/MyPlantsTab';
import AddPlantScreen from '../screens/AddPlantScreen';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import CategoriesScreen from '../screens/CategoriesScreen';

export type MyPlantsStackParamList = {
  MyPlantsTab: undefined;
  AddPlantScreen: undefined;
  PlantDetailScreen: { plantId: number };
  CategoriesScreen: undefined;
};

const Stack = createNativeStackNavigator<MyPlantsStackParamList>();

export default function MyPlantsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="MyPlantsTab">
      <Stack.Screen name="MyPlantsTab" component={MyPlantsTab} options={{ headerShown: false}} />
      <Stack.Screen name="AddPlantScreen" component={AddPlantScreen} options={{ title: 'Aggiungi Pianta' }} />
      <Stack.Screen name="PlantDetailScreen" component={PlantDetailScreen} options={{ title: 'Dettaglio Pianta' }} />
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} options={{ title: 'Categorie' }} />
    </Stack.Navigator>
  );
}
