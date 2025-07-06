import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import HomeScreen from '../tabs/HomeScreen';
import MyPlantsScreen from '../tabs/MyPlantsScreen';
import AddPlantScreen from '../tabs/AddPlantScreen';
import SearchScreen from '../tabs/SearchScreen';
import AnalyticsScreen from '../tabs/AnalyticsScreen';
import Ionicons from '@expo/vector-icons/Ionicons'; // icone standard

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'My Plants':
              iconName = 'leaf';
              break;
            case 'Search':
              iconName = 'search';
              break;
            case 'Analysis':
              iconName = 'bar-chart';
              break;
            default:
              iconName = 'help';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#c0eac0',
        tabBarStyle: {
          backgroundColor: '#4CAF50',
          height: 60,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Plants" component={MyPlantsScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Analysis" component={AnalyticsScreen} />
      <Tab.Screen
        name="Add Plants"
        component={AddPlantScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;