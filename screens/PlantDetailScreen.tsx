import React, {useCallback, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Plant } from '../models/Plant';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getConnection, deletePlant, getPlants } from '../db';

export default function PlantDetailScreen({ route }: { route: any }) {
    const navigation = useNavigation<any>();
    const plant = route.params;
    const [updatedPlant, setUpdatedPlant] = useState(plant);

    useFocusEffect(
        useCallback(() =>{
            const fetchUpdatedPlant = async () => {
                const db = await getConnection();
                const allPlants= await getPlants(db);
                const newPlant = allPlants.find((p) => p.key === updatedPlant.key);
                if (newPlant){
                    setUpdatedPlant(newPlant);
                }
            };
            fetchUpdatedPlant();
        }, [updatedPlant.key])
    );

    const handleEdit = () => {
        navigation.navigate('AddPlantScreen', { plantData: updatedPlant });
    };

    const handleDelete = async () => {
        Alert.alert(
            'Conferma eliminazione',
            'Sei sicuro di voler eliminare questa pianta?',
            [
                {
                    text: 'Annulla',
                    style: 'cancel',
                },
                {
                    text: 'Elimina',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const db = await getConnection();
                            await deletePlant(db, updatedPlant.key);
                            navigation.goBack();
                        } catch (error) {
                            console.error('Errore durante eliminazione:', error);
                            Alert.alert('Errore', 'Impossibile eliminare la pianta');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Dettaglio Pianta</Text>
            <Text style={styles.label}>🌱 Nome: <Text style={styles.value}>{updatedPlant.name}</Text></Text>
            <Text style={styles.label}>🔖 Specie: <Text style={styles.value}>{updatedPlant.species}</Text></Text>
            <Text style={styles.label}>📅 Acquisizione: <Text style={styles.value}>{new Date(updatedPlant.ownedSince).toISOString().split('T')[0]}</Text></Text>
            <Text style={styles.label}>💧 Innaffiatura: <Text style={styles.value}>{updatedPlant.waterFrequency} giorni</Text></Text>
            <Text style={styles.label}>🌿 Potatura: <Text style={styles.value}>{updatedPlant.pruneFrequency} giorni</Text></Text>
            <Text style={styles.label}>🪴 Rinvaso: <Text style={styles.value}>{updatedPlant.repotFrequency} giorni</Text></Text>
            <Text style={styles.label}>❤️ Stato: <Text style={styles.value}>{updatedPlant.state}</Text></Text>
            <Text style={styles.label}>🗂️ Categorie: <Text style={styles.value}>{updatedPlant.category || '-'}</Text></Text>
            <Text style={styles.label}>📝 Note: <Text style={styles.value}>{updatedPlant.notes || '-'}</Text></Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Modifica</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Elimina</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 12,
    },
    value: {
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 30,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
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
