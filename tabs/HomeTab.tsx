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
import { getConnection, getCurablePlants, getPlants, getRecentPlants, updatePlant } from '../db';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../models/HomeStackNavigator';

const HomeTab = () => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [curablePlants, setCurablePlants] = useState<Plant[]>([]);
    
    useEffect(() => {
        const focus = navigation.addListener('focus', () => {
            const loadRecentPlants = async () => {
            try{
                const db = await getConnection();

                const recentPlants = await getRecentPlants(db);
                setPlants(recentPlants);
            }
            catch (error) {
                console.error('Error loading recent plants:', error);
            }
            };
            loadRecentPlants();

            const loadCurablePlants = async () => {
                try{
                    const db = await getConnection();
                    const curablePlants = await getCurablePlants(db);
                    setCurablePlants(curablePlants);
                }
                catch (error) {
                    console.error('Error loading curable plants:', error);
                }
            };
            loadCurablePlants();
        });
        return focus;
    }, []);
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Plant Care App</Text>

            <Text style={styles.sectionTitle}>Recently added plants</Text>

            {plants.length === 0 ? (
                <Text style={styles.emptyMessage}>There are no recent plants.</Text>
            ) : (

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
            )}
            <View style={styles.boxContainer}>
            {curablePlants.length === 0 ? (
                <Text style={styles.emptyMessage}>There are no curable plants.</Text>
            ) : (
                <FlatList
                    data={curablePlants}
                    keyExtractor={(item) => item.key.toString()}
                    renderItem={({ item }) => (
                        
                        <TouchableOpacity onPress={() => navigation.navigate('PlantDetailScreen', item)} style={styles.itemContainer}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                
                            <View style={styles.textContainer}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.species}>{item.species}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        const db = await getConnection();
                                        await updatePlant(db, item, true);
                                        console.log('Cured plant:', item.name);
                                        navigation.replace('HomeTab');
                                    } catch (error) {
                                        console.error('Error while caring for the plant:', error);
                                    }
                                }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Cure</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}
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
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        fontStyle: 'italic',
        color: '#888',
        marginVertical: 20,
    },
});