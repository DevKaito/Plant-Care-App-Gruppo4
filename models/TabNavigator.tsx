import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AnalyticsTab from '../tabs/AnalyticsTab';
import MyPlantsStackNavigator from './MyPlantsStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import SearchStackNavigator from './SearchStackNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="My Plants" 
        component={MyPlantsStackNavigator} 
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="plant-wilt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchStackNavigator} 
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome6 name="magnifying-glass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Analysis" 
        component={AnalyticsTab} 
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="google-analytics" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
