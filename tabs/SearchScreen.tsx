import React from "react";
import { StatusBar, View, Text } from "react-native";

export default function SearchScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Search for plants!</Text>
            <StatusBar />
        </View>
    );
}