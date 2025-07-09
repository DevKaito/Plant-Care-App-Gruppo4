import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import { Plant } from '../models/Plant';
import { getConnection, getPlants, getRecentPlants } from '../db';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../models/HomeStackNavigator';

// type Plant = {
//     id: string;
//     name: string;
//     image: string;
// };

// const dummyPlants: Plant[] = [
//     { id: 'p1', name: 'Mimosa sensitiva', image: 'https://cdn-icons-png.flaticon.com/128/3800/3800257.png' },
//     { id: 'p2', name: 'Nome p2', image: 'https://cdn-icons-png.flaticon.com/128/3800/3800257.png' },
//     { id: 'p3', name: 'Nome p3', image: 'https://cdn-icons-png.flaticon.com/128/3800/3800257.png' },
//     { id: 'p4', name: 'Nome p3', image: 'https://cdn-icons-png.flaticon.com/128/3800/3800257.png' },
//     { id: 'p5', name: 'Nome p3', image: 'https://cdn-icons-png.flaticon.com/128/3800/3800257.png' },
// ];

/*const getMotivation = (item: Plant): string => {
    const needs: string[] = [];

    if (item.waterFrequency === 0) needs.push('va innaffiata');
    if (item.pruneFrequency === 0) needs.push('va potata');
    if (item.repotFrequency === 0) needs.push('va rinvasata');
    return needs.join(', ');
};*/

const HomeTab = () => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [curablePlants, setCurablePlants] = useState<Plant[]>([]);

    useEffect(() => {
        const focus = navigation.addListener('focus', () => {
            const loadPlants = async () => {
            try{
                console.log('Caricamento piante recenti...');
                const db = await getConnection();

                const recentPlants = await getRecentPlants(db);
                setPlants(recentPlants);

                const curablePlantList = await getPlants(db);
                setCurablePlants(curablePlantList);
            }
            catch (error) {
                console.error('Errore nel caricamento delle piante recenti:', error);
            }
        };
            loadPlants();
        });
        return focus;
    }, []);
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Plant Care App</Text>

            <Text style={styles.sectionTitle}>Recently added plants</Text>

            <FlatList
                data={plants.slice(0, 3)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.key.toString()}
                contentContainerStyle={[
                    styles.plantListContainer,
                    {
                        justifyContent:
                            plants.length === 1 ? 'center' :
                            plants.length === 2 ? 'space-evenly' :
                            'space-between',
                            paddingHorizontal: plants.length === 1 ? 0 : 16,
                    }
                ]}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('PlantDetailScreen', item)} style={styles.plantCard}>
                        <Image source={{uri: item.image}} style={styles.plantImage}></Image>
                        <Text style={styles.plantName}>{item.name}</Text>
                        <Text style={styles.plantSpecies}>{item.species}</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.boxContainer}>
                <FlatList
                    data={curablePlants}
                    keyExtractor={(item) => item.key.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.species}>{item.species}</Text>
                            <Text style={styles.illness}>Motivation: {item.name}</Text>   {/* item.name è provvisorio, ci va la motivazione della cura (va potata, innaffiata ecc o direttamente è malata/da controllare) */}
                        </View>

                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Cure</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                />
            </View>

        </SafeAreaView>
    );
};

export default HomeTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 48,
        marginBottom: 32,
    },

    boxContainer: {
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 16,
        backgroundColor: '#cffcd2',
        paddingLeft: 8,
        paddingTop: 8,
        paddingBottom: 8,
        marginRight: 30,
        marginLeft: 30,
        marginBottom: 20,
        height: 320,
    },
    plantListContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 0,
    },
    plantCard: {
        alignItems: 'center',
        width: 100,
    },
    
    plantImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 2,
        marginBottom: 8,
        backgroundColor: '#eee',
    },

    plantName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    plantSpecies: {
        fontSize: 12,
        color: '#555',
        textAlign: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    image: {
        width: 58,
        height: 58,
        borderRadius: 10,
        borderWidth: 2,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    species: {
        fontSize: 14,
        color: '#555',
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    illness: {
        fontStyle: 'italic',
        fontSize: 12,
    },
});