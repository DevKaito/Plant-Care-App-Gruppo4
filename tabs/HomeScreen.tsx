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
    image: string;
};

const dummyPlants: Plant[] = [
    { id: 'p1', name: 'Mimosa sensitiva', image: 'https://cdn-icons-png.flaticon.com/128/3800/3800257.png' },
    { id: 'p2', name: 'Nome p2', image: 'https://cdn-icons-png.flaticon.com/128/3800/3800257.png' },
    { id: 'p3', name: 'Nome p3', image: 'https://cdn-icons-png.flaticon.com/128/3800/3800257.png' },
    { id: 'p4', name: 'Nome p3', image: 'https://cdn-icons-png.flaticon.com/128/3800/3800257.png' },
    { id: 'p5', name: 'Nome p3', image: 'https://cdn-icons-png.flaticon.com/128/3800/3800257.png' },
];

const HomeScreen: React.FC = () => {
    const renderPlantItem = ({ item }: { item: Plant }) => (
        <View style={styles.row}>
            <View style={styles.idBox}>
                <Image
                        source={{ uri: item.image }}
                        style={styles.boxImage}
                    />
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
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/882/882968.png' }}
                        style={styles.categoryImage}
                    />
                    <Text style={styles.categoryText}>Cactus</Text>
                </View>
                <View style={styles.categoryItem}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2220/2220105.png' }}
                        style={styles.categoryImage}
                    />
                    <Text style={styles.categoryText}>Palma</Text>
                </View>
                <View style={styles.categoryItem}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/2362/2362691.png' }}
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


