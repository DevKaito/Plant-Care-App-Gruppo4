import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../tabs/HomeScreen';
import MyPlantsScreen from '../tabs/MyPlantsScreen'; // ✅ nuovo import
import AddPlantScreen from '../tabs/AddPlantScreen';
import SearchScreen from '../tabs/SearchScreen';
import AnalyticsScreen from '../tabs/AnalyticsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Plants" component={MyPlantsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Analysis" component={AnalyticsScreen} />
      <Tab.Screen
        name="Add Plants"
        component={AddPlantScreen}
        options={{ tabBarButton: () => null }} // ✅ nascosto dalla barra
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
