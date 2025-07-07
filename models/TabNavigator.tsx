import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from '../tabs/HomeTab';
import MyPlantsTab from '../tabs/MyPlantsTab';
import SearchTab from '../tabs/SearchTab';
import AnalyticsTab from '../tabs/AnalyticsTab';
import MyPlantsStackNavigator from './MyPlantsStackNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator backBehavior='history'>
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen name="My Plants" component={MyPlantsStackNavigator} />
      <Tab.Screen name="Search" component={SearchTab} />
      <Tab.Screen name="Analysis" component={AnalyticsTab} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
