import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from '../tabs/HomeTab';
import MyPlantsTab from '../tabs/MyPlantsTab';
import SearchTab from '../tabs/SearchTab';
import AnalyticsTab from '../tabs/AnalyticsTab';
import MyPlantsStackNavigator from './MyPlantsStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import SearchStackNavigator from './SearchStackNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator backBehavior='history' initialRouteName='Home'>
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="My Plants" component={MyPlantsStackNavigator} />
      <Tab.Screen name="Search" component={SearchStackNavigator} />
      <Tab.Screen name="Analysis" component={AnalyticsTab} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
