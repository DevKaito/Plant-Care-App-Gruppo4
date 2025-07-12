import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import CheckBox from "expo-checkbox"
import { deleteCategories, getCategories, getConnection, insertCategory } from "../db";
import { SQLiteDatabase } from "expo-sqlite";

const CategoriesScreen = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [removalMode, setRemovalMode] = useState(false);
    const [selectedForRemoval, setSelectedForRemoval] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const loadCategories = async () => {
            try{
                const db = await getConnection();
                const categories = await getCategories(db);
                setCategories(categories);
            }
            catch(error){
                console.error("Error loading categories", error);
            }
        }

        loadCategories();
    }, []);

    const handleAddCategory = async () => {
        if (newCategory.trim() === "") {
            Alert.alert("Error", "Category name cannot be empty.");
            return;
        }
        if (categories.includes(newCategory.trim())) {
            Alert.alert("Error", "This category already exists.");
            return;
        }
        const db = await getConnection();
        await insertCategory(db, newCategory);
        setCategories([...categories, newCategory.trim()]);
        setNewCategory("");
    };

    const toggleRemovalMode = () => {
        setRemovalMode(!removalMode);
        setSelectedForRemoval({});
    };

    const handleCheckboxChange = (category: string) => {
        setSelectedForRemoval(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const confirmRemoval = async () => {
        const filtered = categories.filter(cat => !selectedForRemoval[cat]);
        const removed = categories.filter(cat => selectedForRemoval[cat]);
        const db = await getConnection();
        await deleteCategories(db, removed);

        setCategories(filtered);
        setRemovalMode(false);
        setSelectedForRemoval({});
    };

    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.categoryItem}>
            {removalMode && (
                <CheckBox
                    value={!!selectedForRemoval[item]}
                    onValueChange={() => handleCheckboxChange(item)}
                />
            )}
            <Text style={styles.categoryText}>{item}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Categories</Text>

            {!removalMode && (
                <>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="New category"
                            value={newCategory}
                            onChangeText={setNewCategory}
                            style={styles.input}
                        />
                        <Button title="Add" onPress={handleAddCategory} />
                    </View>
                </>
            )}

            <FlatList
                data={categories}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={renderItem}
            />

            <View style={styles.buttonContainer}>
                {!removalMode ? (
                    <Button title="Remove categories" onPress={toggleRemovalMode} />
                ) : (
                    <>
                        <Button title="Confirm removal" color="red" onPress={confirmRemoval} />
                        <Button title="Cancel" onPress={toggleRemovalMode} />
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderColor: "#ccc",
        borderWidth: 1,
        marginRight: 10,
        padding: 8,
        borderRadius: 5,
    },
    categoryItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    categoryText: {
        marginLeft: 10,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default CategoriesScreen;