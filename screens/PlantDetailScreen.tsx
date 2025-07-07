import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlantDetailScreen({ route }: { route: any }) {
    const { plantId } = route.params;
    return (
        <View>
            <Text>Dettaglio Pianta</Text>
            <Text>ID della pianta: {plantId}</Text>
        </View>
    );
}