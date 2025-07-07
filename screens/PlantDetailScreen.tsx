import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

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

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.editButton]}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        
    },
    title: {
        
    },
    name: {
        
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    editButton: {
        backgroundColor: '#4CAF50',
    },
    deleteButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
