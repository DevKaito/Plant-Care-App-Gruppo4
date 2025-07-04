import React from "react";
import { View, Text, StatusBar, StyleSheet } from "react-native";

export default function AddPlantScreen() {
    return (
        <View style={styles.container}>
            <Text>Add a new plant!</Text>
            <StatusBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});