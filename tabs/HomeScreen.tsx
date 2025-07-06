import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';

type Plant = {
    id: string;
    name: string;
};

const dummyPlants: Plant[] = [
    { id: 'p1', name: 'Nome p1' },
    { id: 'p2', name: 'Nome p2' },
    { id: 'p3', name: 'Nome p3' },
];

const HomeScreen: React.FC = () => {
    const renderPlantItem = ({ item }: { item: Plant }) => (
        <View style={styles.row}>
            <View style={styles.idBox}>
                <Text style={styles.idText}>{item.id}</Text>
            </View>
            <View style={styles.nameBox}>
                <Text style={styles.nameText}>{item.name}</Text>
            </View>
            <TouchableOpacity style={styles.curaButton}>
                <Text style={styles.curaText}>Cura</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Plant Care App</Text>

            <Text style={styles.sectionTitle}>Piante aggiunte di recente</Text>

            <View style={styles.categoryRow}>
                <View style={styles.categoryItem}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/60?text=Cactus' }}
                        style={styles.categoryImage}
                    />
                    <Text style={styles.categoryText}>Cactus</Text>
                </View>
                <View style={styles.categoryItem}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/60?text=Palma' }}
                        style={styles.categoryImage}
                    />
                    <Text style={styles.categoryText}>Palma</Text>
                </View>
                <View style={styles.categoryItem}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/60?text=Bonsai' }}
                        style={styles.categoryImage}
                    />
                    <Text style={styles.categoryText}>Bonsai</Text>
                </View>
            </View>

            <View style={styles.boxContainer}>
                <FlatList
                    data={dummyPlants}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPlantItem}
                />
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginVertical: 8,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    categoryItem: {
        alignItems: 'center',
    },
    categoryImage: {
        width: 60,
        height: 60,
    },
    categoryText: {
        marginTop: 4,
        fontSize: 12,
    },
    boxContainer: {
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 8,
        padding: 8,
        marginBottom: 80,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    idBox: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 4,
        marginRight: 10,
    },
    idText: {
        color: 'white',
        fontWeight: 'bold',
    },
    nameBox: {
        flex: 1,
    },
    nameText: {
        fontSize: 16,
    },
    curaButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    curaText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});


