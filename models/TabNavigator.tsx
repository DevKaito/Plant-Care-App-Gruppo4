import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../tabs/HomeScreen";
import AddPlantScreen from "../tabs/AddPlantScreen";
import SearchScreen from "../tabs/SearchScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home" backBehavior="history">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AddPlant" component={AddPlantScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
    </Tab.Navigator>
  );
}