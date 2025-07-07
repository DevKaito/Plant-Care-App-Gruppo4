import React from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';

export default function PlantDetailScreen({ route }: { route: any }) {
    const {
        name,
        species,
        acquisitionDate,
        pruning,
        repotting,
        watering,
        status,
        notes,
    } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Dettaglio Pianta</Text>
            <Text style={styles.name}>Nome: {name}.</Text>
            <Text>Specie: {species}.</Text>
            <Text>Data di acquisizione: {acquisitionDate}.</Text>
            <Text>Frequenza di potatura: {pruning} giorni.</Text>
            <Text>Frequenza di rinvaso: {repotting} giorni.</Text>
            <Text>Frequenza di innaffiatura: {watering} giorni.</Text>
            <Text>Stato della pianta: {status}.</Text>
            <Text>Note relative alla pianta: {notes}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    title: {

    },
    name: {

    }
});