import React, { useState, useEffect } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from '@react-navigation/native';
import { getConnection, getPlants } from '../db';
import { Plant, PlantState } from '../models/Plant';

export default function SearchScreen() {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Plant[]>([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            const db = await getConnection();
            const allPlants = await getPlants(db);
            const uniqueCategories = [...new Set(allPlants.map(p => p.category))];
            setCategories(uniqueCategories);
        })();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, statusFilter, categoryFilter]);

    const handleSearch = async () => {
        const query = searchQuery.trim().toLowerCase();

        try {
            const db = await getConnection();
            let allPlants = await getPlants(db);

            let filtered = allPlants.filter((plant) => {
                const matchesQuery =
                    plant.name.toLowerCase().includes(query) ||
                    plant.species.toLowerCase().includes(query);

                const matchesStatus =
                    statusFilter === "" || plant.state?.toLowerCase() === statusFilter.toLowerCase();

                const matchesCategory =
                    categoryFilter === "" || plant.category === categoryFilter;

                return matchesQuery && matchesStatus && matchesCategory;
            });

            setSearchResults(filtered);
        } catch (error) {
            console.error("Search error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="🔍 Search"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                style={styles.input}
            />

          <View style={styles.filterRow}>
    <View style={styles.dropdownWrapperStatus}>
        <Picker
            selectedValue={statusFilter}
            onValueChange={(itemValue) => setStatusFilter(itemValue)}
            style={styles.dropdown}
            dropdownIconColor="gray"
        >
            <Picker.Item label="Stato pianta" value="" />
            <Picker.Item label="Sana" value={PlantState.Healthy.toLowerCase()} />
            <Picker.Item label="Da controllare" value={PlantState.ToCheck.toLowerCase()} />
            <Picker.Item label="Malata" value={PlantState.Sick.toLowerCase()} />
        </Picker>
    </View>

    <View style={styles.dropdownWrapperCategory}>
        <Picker
            selectedValue={categoryFilter}
            onValueChange={(itemValue) => setCategoryFilter(itemValue)}
            style={styles.dropdown}
            dropdownIconColor="gray"
        >
            <Picker.Item label="Categorie" value="" />
            {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
            ))}
        </Picker>
    </View>
</View>

            {(searchQuery.length > 0 || statusFilter || categoryFilter) && (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.key.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.plantCard}
                            onPress={() => navigation.navigate('PlantDetailScreen', item)}
                        >
                            <Image
                                source={{ uri: item.image || 'https://via.placeholder.com/50' }}
                                style={styles.plantImage}
                            />
                            <View style={styles.plantInfo}>
                                <Text style={styles.plantName}>{item.name}</Text>
                                <Text style={styles.plantSpecies}>{item.species}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <Text style={styles.noResultsText}>Nessun risultato trovato!</Text>
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
        padding: 16,
    },
    input: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dropdownWrapperStatus: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    marginHorizontal: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 2,
    width: 150,  
},
dropdownWrapperCategory: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    marginHorizontal: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 2,
    flex: 1, 
       
    },
    dropdown: {
        height: 50,
        width: '100%',
        color: '#000',
        fontSize:10,
        backgroundColor: '#fff',
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


