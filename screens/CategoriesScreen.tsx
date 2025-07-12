import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    StyleSheet,
    Alert,
    useWindowDimensions,
} from "react-native";
import CheckBox from "expo-checkbox";
import { deleteCategories, getCategories, getConnection, insertCategory } from "../db";

const CategoriesScreen = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [removalMode, setRemovalMode] = useState(false);
    const [selectedForRemoval, setSelectedForRemoval] = useState<{ [key: string]: boolean }>({});

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const db = await getConnection();
                const cats = await getCategories(db);
                setCategories(cats);
            } catch (error) {
                console.error("Error loading categories", error);
            }
        };

        loadCategories();
    }, []);

    const handleAddCategory = async () => {
        const trimmed = newCategory.trim();
        if (trimmed === "") {
            Alert.alert("Error", "Category name cannot be empty.");
            return;
        }
        if (categories.includes(trimmed)) {
            Alert.alert("Error", "This category already exists.");
            return;
        }
        const db = await getConnection();
        await insertCategory(db, trimmed);
        setCategories([...categories, trimmed]);
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
        const toDelete = categories.filter(cat => selectedForRemoval[cat]);
        const filtered = categories.filter(cat => !selectedForRemoval[cat]);

        const db = await getConnection();
        await deleteCategories(db, toDelete);

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
        <View style={[styles.container, isLandscape && styles.landscapeContainer]}>
            <View style={[styles.leftSide, isLandscape && styles.leftSideLandscape]}>
                <Text style={styles.title}>Categories</Text>

                {!removalMode && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="New category"
                            value={newCategory}
                            onChangeText={setNewCategory}
                            style={styles.input}
                        />
                        <Button title="ADD" onPress={handleAddCategory} />
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    {!removalMode ? (
                        <Button
                            title="REMOVE CATEGORIES"
                            onPress={toggleRemovalMode}
                            color="#d32f2f" // rosso
                        />
                    ) : (
                        <>
                            <Button
                                title="CONFIRM REMOVAL"
                                color="#d32f2f"
                                onPress={confirmRemoval}
                            />
                            <View style={{ marginTop: 10 }}>
                                <Button title="CANCEL" onPress={toggleRemovalMode} />
                            </View>
                        </>
                    )}
                </View>
            </View>

            <View style={[styles.rightSide, isLandscape && styles.rightSideLandscape]}>
                <FlatList
                    data={categories}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.empty}>No categories yet.</Text>}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    landscapeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    leftSide: {
        width: "100%",
    },
    leftSideLandscape: {
        width: "45%",
    },
    rightSide: {
        flex: 1,
    },
    rightSideLandscape: {
        width: "50%",
        marginLeft: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
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
        padding: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        marginTop: 10,
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
    empty: {
        textAlign: "center",
        color: "#999",
        marginTop: 30,
    },
});

export default CategoriesScreen;
