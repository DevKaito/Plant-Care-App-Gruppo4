import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../tabs/HomeScreen';
import AddPlantScreen from '../tabs/AddPlantScreen';
import SearchScreen from '../tabs/SearchScreen';
import AnalyticsScreen from '../tabs/AnalyticsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add Plants" component={AddPlantScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Analysis" component={AnalyticsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;