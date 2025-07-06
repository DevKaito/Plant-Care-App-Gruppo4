import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Plant = {
    id: string;
    name: string;
};

const dummyPlants: Plant[] = [
    { id: 'p1', name: 'Cactus' },
    { id: 'p2', name: 'Palma' },
    { id: 'p3', name: 'Bonsai' },
];

const MyPlantsScreen = () => {
    const navigation = useNavigation<any>();

    const renderPlant = ({ item }: { item: Plant }) => (
        <View style={styles.plantItem}>
            <Text style={styles.plantName}>{item.name}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Le mie piante</Text>

            <FlatList
                data={dummyPlants}
                keyExtractor={(item) => item.id}
                renderItem={renderPlant}
                contentContainerStyle={styles.list}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Add Plants')}
            >
                <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default MyPlantsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 100,
    },
    plantItem: {
        padding: 12,
        backgroundColor: '#e6ffe6',
        borderRadius: 8,
        marginBottom: 10,
    },
    plantName: {
        fontSize: 16,
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 90,
        backgroundColor: '#4CAF50',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    addText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
});
