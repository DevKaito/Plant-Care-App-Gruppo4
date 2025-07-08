import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    Keyboard,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { getConnection, getPlants } from '../db';
import { Plant } from '../models/Plant';


export default function SearchScreen() {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Plant[]>([]);

    const handleSearch = async () => {
        const query = searchQuery.trim().toLowerCase();

        try {
            const db = await getConnection();
            let allPlants = await getPlants(db);

            let filtered = allPlants.filter(
                (plant) => plant.name.toLowerCase().includes(query) || plant.species.toLowerCase().includes(query)
            );

            setSearchResults(filtered);
            Keyboard.dismiss();
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search..."
                value={searchQuery}
                onChangeText={(text) => {
                    setSearchQuery(text);
                    if (text.trim() === '') {
                        setSearchResults([]);
                    }
                }}
                onSubmitEditing={handleSearch}
                style={styles.input}
            />

            {searchQuery.length > 0 && (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.key.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.plantCard}
                            onPress={() => navigation.navigate('PlantDetailScreen', item)}
                        >
                            <Image
                                source={{ uri: item.image || 'Immagine Fittizia' }}              //da inserire immagine fittizia
                                style={styles.plantImage}
                            />
                            <View style={styles.plantInfo}>
                                <Text style={styles.plantName}>{item.name}</Text>
                                <Text style={styles.plantSpecies}>{item.species}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <Text style={styles.noResultsText}>No results found!</Text>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 16
    },
    input: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 6,
        padding: 8,
        marginBottom: 12,
    },
    noResultsText: {
        padding: 10,
        fontStyle: 'italic',
        color: 'grey',
    },
    plantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    plantImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    plantInfo: {
        flex: 1,
    },
    plantName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    plantSpecies: {
        fontSize: 14,
        color: '#666',
    },
});
