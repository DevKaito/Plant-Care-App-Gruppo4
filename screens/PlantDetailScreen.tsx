import React, {useCallback, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
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
            'Confirm deletion',
            'Are you sure you want to remove this plant?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const db = await getConnection();
                            await deletePlant(db, updatedPlant.key);
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error while deleting:', error);
                            Alert.alert('Error', 'Impossible to eliminate the plant');
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Plant detail</Text>
            <Text style={styles.label}>🌱 Name: <Text style={styles.value}>{updatedPlant.name}</Text></Text>
            <Text style={styles.label}>🔖 Species: <Text style={styles.value}>{updatedPlant.species}</Text></Text>
            <Text style={styles.label}>📅 Acquisition: <Text style={styles.value}>{new Date(updatedPlant.ownedSince).toISOString().split('T')[0]}</Text></Text>
            <Text style={styles.label}>💧 Watering: <Text style={styles.value}>{updatedPlant.waterFrequency} days</Text></Text>
            <Text style={styles.label}>🌿 Pruning: <Text style={styles.value}>{updatedPlant.pruneFrequency} days</Text></Text>
            <Text style={styles.label}>🪴 Repotting: <Text style={styles.value}>{updatedPlant.repotFrequency} days</Text></Text>
            <Text style={styles.label}>❤️ State: <Text style={styles.value}>{updatedPlant.state}</Text></Text>
            <Text style={styles.label}>🗂️ Categories: <Text style={styles.value}>{updatedPlant.category || '-'}</Text></Text>
            <Text style={styles.label}>📝 Notes: <Text style={styles.value}>{updatedPlant.notes || '-'}</Text></Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                    <Text style={styles.buttonText}>Delete</Text>
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