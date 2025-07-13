import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getConnection, getPlants } from '../db';
import { Plant, PlantState } from '../models/Plant';
import { SearchStackParamList } from "../models/SearchStackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function SearchScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Plant[]>([]);

    const [openStatus, setOpenStatus] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const [openCategory, setOpenCategory] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    const [categories, setCategories] = useState<string[]>([]);

    const statusItems = [
        { label: "Healthy", value: PlantState.Healthy.toLowerCase() },
        { label: "To check", value: PlantState.ToCheck.toLowerCase() },
        { label: "Sick", value: PlantState.Sick.toLowerCase() },
    ];

    useEffect(() => {
        const focus = navigation.addListener('focus', () => {
            setOpenStatus(false);
            setOpenCategory(false);
            setStatusFilter(null);
            setCategoryFilter(null);
            setSearchQuery("");

            const loadPlants = async () => {
                try {
                    const db = await getConnection();
                    const allPlants = await getPlants(db);

                    const uniqueCategories = [...new Set(
                        allPlants
                            .map(p => p.category)
                            .filter((cat): cat is string => cat !== null && cat.trim() !== '')
                    )];

                    setCategories(uniqueCategories);
                } catch (error) {
                    console.error('Search error', error);
                }
            };

            loadPlants();
        });

        return focus;
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
                    !statusFilter || plant.state?.toLowerCase() === statusFilter.toLowerCase();

                const matchesCategory =
                    !categoryFilter || plant.category === categoryFilter;

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
                onChangeText={setSearchQuery}
                style={styles.input}
            />

            <View style={styles.filterRow}>
                <View style={styles.dropdownWrapperStatus}>
                    <DropDownPicker
                        open={openStatus}
                        value={statusFilter}
                        items={statusItems}
                        setOpen={setOpenStatus}
                        setValue={setStatusFilter}
                        placeholder="Plant state"
                        dropDownDirection="BOTTOM"
                        style={styles.dropdown}
                        dropDownContainerStyle={{ backgroundColor: '#fff' }}
                        zIndex={3000}
                        zIndexInverse={1000}
                    />
                </View>

                <View style={styles.dropdownWrapperCategory}>
                    <DropDownPicker
                        open={openCategory}
                        value={categoryFilter}
                        items={categories.map(cat => ({ label: cat, value: cat }))}
                        setOpen={setOpenCategory}
                        setValue={setCategoryFilter}
                        placeholder="Categories"
                        dropDownDirection="BOTTOM"
                        style={styles.dropdown}
                        dropDownContainerStyle={{ backgroundColor: '#fff' }}
                        zIndex={2000}
                        zIndexInverse={2000}
                    />
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
        zIndex: 1000,
    },
    dropdownWrapperStatus: {
        width: 150,
        marginHorizontal: 4,
        zIndex: 3000,
    },
    dropdownWrapperCategory: {
        flex: 1,
        marginHorizontal: 4,
        zIndex: 2000,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderColor: 'gray',
        borderWidth: 1,
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
