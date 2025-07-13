import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    useWindowDimensions,
} from 'react-native';
import { Plant } from '../models/Plant';
import {
    getConnection,
    getCurablePlants,
    getRecentPlants,
    updatePlant,
} from '../db';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../models/HomeStackNavigator';

const HomeTab = () => {
    const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const [recentPlants, setRecentPlants] = useState<Plant[]>([]);
    const [curablePlants, setCurablePlants] = useState<Plant[]>([]);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                const db = await getConnection();
                const [recent, curable] = await Promise.all([
                    getRecentPlants(db),
                    getCurablePlants(db),
                ]);
                setRecentPlants(recent);
                setCurablePlants(curable);
            } catch (error) {
                console.error('Error loading plants:', error);
            }
        });

        return unsubscribe;
    }, []);

    const renderRecentPlants = () => (
        <View style={styles.recentContainer}>
            <Text style={styles.sectionTitle}>Recently added</Text>
            {recentPlants.length === 0 ? (
                <Text style={styles.emptyMessage}>No recent plants.</Text>
            ) : (
                <FlatList
                    data={recentPlants.slice(0, 3)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.key.toString()}
                    contentContainerStyle={[
                        styles.plantListContainer,
                        {
                            justifyContent:
                                recentPlants.length === 1
                                    ? 'center'
                                    : recentPlants.length === 2
                                        ? 'space-evenly'
                                        : 'space-between',
                        },
                    ]}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PlantDetailScreen', item)}
                            style={styles.plantCard}
                        >
                            <Image source={{ uri: item.image }} style={styles.plantImage} />
                            <Text style={styles.plantName}>{item.name}</Text>
                            <Text style={styles.plantSpecies}>{item.species}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );

    const renderCurablePlant = ({ item }: { item: Plant }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate('PlantDetailScreen', item)}
                style={styles.infoContainer}
            >
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.species}>{item.species}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={async () => {
                    try {
                        const db = await getConnection();
                        await updatePlant(db, item, true);
                        const updated = await getCurablePlants(db);
                        setCurablePlants(updated);
                    } catch (error) {
                        console.error('Error while caring for the plant:', error);
                    }
                }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Cure</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={[styles.header, isLandscape && styles.headerLandscape]}>
                Plant Care App
            </Text>

            {isLandscape ? (
                <View style={styles.landscapeWrapper}>
                    <View style={styles.leftPane}>{renderRecentPlants()}</View>
                    <View style={styles.rightPane}>
                        <Text style={styles.sectionTitle}>Curable plants</Text>
                        <FlatList
                            data={curablePlants}
                            keyExtractor={(item) => item.key.toString()}
                            renderItem={renderCurablePlant}
                            ListEmptyComponent={
                                <Text style={styles.emptyMessage}>No curable plants.</Text>
                            }
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    </View>
                </View>
            ) : (
                <>
                    {renderRecentPlants()}
                    <Text style={styles.sectionTitle}>Curable plants</Text>
                    <FlatList
                        data={curablePlants}
                        keyExtractor={(item) => item.key.toString()}
                        renderItem={renderCurablePlant}
                        ListEmptyComponent={
                            <Text style={styles.emptyMessage}>No curable plants.</Text>
                        }
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                </>
            )}
        </View>
    );
};

export default HomeTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 24,
    },
    headerLandscape: {
        fontSize: 28,
        marginVertical: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        fontStyle: 'italic',
        color: '#888',
        marginVertical: 20,
    },
    plantListContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingBottom: 16,
    },
    plantCard: {
        alignItems: 'center',
        width: 100,
        marginHorizontal: 8,
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
        backgroundColor: '#cffcd2',
        borderRadius: 10,
        marginVertical: 6,
        padding: 10,
    },
    infoContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
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
    landscapeWrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    leftPane: {
        flex: 1,
        paddingRight: 12,
    },
    rightPane: {
        flex: 1,
        paddingLeft: 12,
    },
    recentContainer: {
        marginBottom: 16,
    },
});
