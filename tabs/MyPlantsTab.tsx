import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ScrollView,
} from 'react-native';
import { Plant } from '../models/Plant';
import { useNavigation } from '@react-navigation/native';
import { getConnection, getPlants } from '../db';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MyPlantsStackParamList } from '../models/MyPlantsStackNavigator';

const MyPlantsTab = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MyPlantsStackParamList>>();
    const [plants, setPlants] = useState<Plant[]>([]);
    const [groupByCategory, setGroupByCategory] = useState(false);

    useEffect(() => {
        const focus = navigation.addListener('focus', () => {
            const loadPlants = async () => {
                try {
                    const db = await getConnection();
                    const plantData = await getPlants(db);
                    setPlants(plantData);
                } catch (error) {
                    console.error('Plant loading error:', error);
                }
            };

            loadPlants();
        });

        return focus;
    }, [navigation]);

    const groupPlantsByCategory = (plants: Plant[]) => {
        const grouped: { [category: string]: Plant[] } = {};
        plants.forEach((plant) => {
            const category = plant.category || 'With no category';
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(plant);
        });
        return grouped;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>My plants</Text>

            <View style={styles.topButtonsContainer}>
                <TouchableOpacity
                    style={styles.topButton}
                    onPress={() => navigation.navigate('CategoriesScreen')}
                >
                    <Text style={styles.topButtonText}>Edit category</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.topButton}
                    onPress={() => setGroupByCategory(!groupByCategory)}
                >
                    <Text style={styles.topButtonText}>
                        {groupByCategory ? 'View all' : 'View by category'}
                    </Text>
                </TouchableOpacity>
            </View>

            {groupByCategory ? (
                <ScrollView>
                    {Object.entries(groupPlantsByCategory(plants)).map(([category, group]) => (
                        <View key={category} style={{ marginBottom: 24 }}>
                            <Text style={styles.sectionTitle}>{category}</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {group.map((item) => (
                                    <TouchableOpacity
                                        key={item.key}
                                        style={styles.plantCard}
                                        onPress={() => navigation.navigate('PlantDetailScreen', item)}
                                    >
                                        <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
                                        <Text>{item.name}</Text>
                                        <Text>{item.species}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <FlatList
                    data={plants}
                    numColumns={3}
                    keyExtractor={(item) => item.key.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.plantCard}
                            onPress={() => navigation.navigate('PlantDetailScreen', item)}
                        >
                            <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
                            <Text>{item.name}</Text>
                            <Text>{item.species}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

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
        marginBottom: 16,
        textAlign: 'center',
    },
    topButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 16,
    },
    topButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    topButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#e0f2f1',
        padding: 8,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 8,
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