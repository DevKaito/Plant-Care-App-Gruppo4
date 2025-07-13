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
    useWindowDimensions,
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
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

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

    const renderPlantCard = (item: Plant) => (
        <TouchableOpacity
            key={item.key}
            style={[
                styles.plantCard,
                { width: isLandscape ? `${100 / 4}%` : `${100 / 3}%` } // 4 colonne in landscape, 3 in portrait
            ]}
            onPress={() => navigation.navigate('PlantDetailScreen', item)}
        >
            <Image source={{ uri: item.image }} style={styles.plantImage} />
            <Text>{item.name}</Text>
            <Text>{item.species}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {isLandscape ? (
                <View style={styles.landscapeWrapper}>
                    <View style={styles.landscapeSidebar}>
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
                    </View>

                    <View style={styles.landscapeContent}>
                        {groupByCategory ? (
                            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                                {Object.entries(groupPlantsByCategory(plants)).map(([category, group]) => (
                                    <View key={category} style={{ marginBottom: 24 }}>
                                        <Text style={styles.sectionTitle}>{category}</Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {group.map(renderPlantCard)}
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            <FlatList
                                data={plants}
                                key={groupByCategory ? 'group' : 'all'}
                                numColumns={4}
                                keyExtractor={(item) => item.key.toString()}
                                renderItem={({ item }) => renderPlantCard(item)}
                                contentContainerStyle={{ paddingBottom: 80 }}
                            />
                        )}
                    </View>
                </View>
            ) : (
                <>
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
                        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                            {Object.entries(groupPlantsByCategory(plants)).map(([category, group]) => (
                                <View key={category} style={{ marginBottom: 24 }}>
                                    <Text style={styles.sectionTitle}>{category}</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {group.map(renderPlantCard)}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <FlatList
                            data={plants}
                            key={groupByCategory ? 'group' : 'all'}
                            numColumns={3}
                            keyExtractor={(item) => item.key.toString()}
                            renderItem={({ item }) => renderPlantCard(item)}
                            contentContainerStyle={{ paddingBottom: 80 }}
                        />
                    )}
                </>
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
    landscapeWrapper: {
        flexDirection: 'row',
        flex: 1,
    },
    landscapeSidebar: {
        width: '40%',
        paddingRight: 12,
    },
    landscapeContent: {
        flex: 1,
        paddingLeft: 12,
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
        flexWrap: 'wrap',
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
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#4CAF50',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        zIndex: 10,
    },
    addText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    plantCard: {
        paddingTop: 24,
        alignItems: 'center',
    },
    plantImage: {
        width: 50,
        height: 50,
        marginBottom: 6,
    },
});
