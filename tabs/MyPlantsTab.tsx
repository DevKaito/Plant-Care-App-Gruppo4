import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image
} from 'react-native';
import { Plant, PlantState } from '../models/Plant';
import { useNavigation } from '@react-navigation/native';
import { createTable, deleteAllPlants, getConnection, getPlants, insertPlant } from '../db';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyPlantsStackParamList } from '../models/MyPlantsStackNavigator';

const MyPlantsTab = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MyPlantsStackParamList>>();
    const [plants, setPlants] = useState<Plant[]>([]);

    useEffect(() => {
        const focus = navigation.addListener('focus', () => {
            const loadPlants = async () => {
                try {
                    console.log('Loading plants...');
                    const db = await getConnection();
                    const plantData = await getPlants(db);
                    setPlants(plantData);
                } catch (error) {
                    console.error('Error loading plants:', error);
                }
            };
            
            loadPlants();
        });

        return focus;
    },[navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Le mie piante</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CategoriesScreen')}>
                <Text style={{fontSize: 20, fontWeight: 'bold', backgroundColor: '#4CAF50'}}>Categorie</Text>
            </TouchableOpacity>
            <FlatList
                data={plants}
                numColumns={3}
                keyExtractor={(item) => item.key.toString()}
                renderItem={item => (
                    <TouchableOpacity style={styles.plantCard} onPress={() => navigation.navigate('PlantDetailScreen', { plantId: item.item.key })}>
                        <Image source={{uri:"https://img.icons8.com/ios-filled/50/potted-plant.png"}} style={{width:50, height:50}}></Image>
                        <Text>{item.item.name}</Text>
                        <Text>{item.item.species}</Text>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddPlantScreen')}
            >
                <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default MyPlantsTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        margin: 10,
        textAlign: 'center',
    },
    addButton: {
        alignSelf: 'flex-end',
        margin: 24,
        backgroundColor: '#4CAF50',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    plantCard: {
        paddingTop: 36,
        width: '33.33%',
        alignItems: 'center',
    },
});
