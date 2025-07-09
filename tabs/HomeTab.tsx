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

const HomeTab = () => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const [plants, setPlants] = useState<Plant[]>([]);

    useEffect(() => {
        const focus = navigation.addListener('focus', () => {
            const loadRecentPlants = async () => {
            try{
                const db = await getConnection();
                const recentPlants = await getRecentPlants(db);
                setPlants(recentPlants);
            }
            catch (error) {
                console.error('Errore nel caricamento delle piante recenti:', error);
            }
        };
            loadRecentPlants();
        });
        return focus;
    }, []);
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Plant Care App</Text>

            <Text style={styles.sectionTitle}>Piante aggiunte di recente</Text>

            <FlatList
                data={plants}
                keyExtractor={(item) => item.key.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('PlantDetailScreen', item)}>
                        <Image source={{uri: item.image}} style={{width: 100, height: 100}}></Image>
                        <Text>{item.name}</Text>
                        <Text>{item.species}</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.boxContainer}>
                <FlatList
                    data={plants}
                    keyExtractor={(item) => item.key.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Text>{item.name}</Text>
                            <Text>{item.species}</Text>
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
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    categoryItem: {
        alignItems: 'center',
        marginBottom: 24,
    },
    categoryImage: {
        width: 64,
        height: 64,
    },
    categoryText: {
        marginTop: 4,
        fontSize: 16,
        fontStyle: 'italic',
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
        maxHeight: 320,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    idBox: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'black',
        marginRight: 10,
    },
    nameBox: {
        flex: 1,
    },
    nameText: {
        fontSize: 17,
        fontWeight: '500',
    },
    curaButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 12,
    },
    curaText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    boxImage: {
        width: 48,
        height: 48,
    }
});



