import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    Button,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    useWindowDimensions,
} from 'react-native';
import { insertPlant, updatePlant, getConnection, getCategories } from '../db';
import { PlantState } from '../models/Plant';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const AddPlantScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const plantToEdit = route.params?.plantData;

    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [acquisitionDate, setAcquisitionDate] = useState('');
    const [pruning, setPruning] = useState('');
    const [repotting, setRepotting] = useState('');
    const [watering, setWatering] = useState('');
    const [status, setStatus] = useState<PlantState>(PlantState.Healthy);
    const [notes, setNotes] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [imageUri, setImageUri] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    useEffect(() => {
        const loadCategories = async () => {
            const db = await getConnection();
            const categories = await getCategories(db);
            setCategories(categories);
        };
        loadCategories();

        if (plantToEdit) {
            setName(plantToEdit.name || '');
            setSpecies(plantToEdit.species || '');
            setAcquisitionDate(plantToEdit.ownedSince ? new Date(plantToEdit.ownedSince).toISOString().split('T')[0] : '');
            setPruning(String(plantToEdit.pruneFrequency || ''));
            setRepotting(String(plantToEdit.repotFrequency || ''));
            setWatering(String(plantToEdit.waterFrequency || ''));
            setStatus(plantToEdit.state);
            setNotes(plantToEdit.notes || '');
            setImageUri(plantToEdit.image || '');
            setCategory(plantToEdit.category);
        }
    }, []);

    const resetForm = () => {
        setName('');
        setSpecies('');
        setAcquisitionDate('');
        setPruning('');
        setRepotting('');
        setWatering('');
        setStatus(PlantState.Healthy);
        setNotes('');
        setImageUri('');
        setCategory('');
    };

    const handleSave = async () => {
        if (!name.trim() || !species.trim() || !acquisitionDate || !watering || !repotting || !pruning) {
            Alert.alert('Error', 'You have to fill in all required fields! (*)');
            return;
        }

        if (
        parseInt(watering) <= 0 || parseInt(repotting) <= 0 || parseInt(pruning) <= 0
    ) {
        Alert.alert('Error', 'Frequencies must be greater than 0!');
        return;
    }

        try {
            const db = await getConnection();

            const newPlant = {
                key: plantToEdit?.key,
                name: name.trim(),
                species: species.trim(),
                ownedSince: new Date(acquisitionDate),
                waterFrequency: watering ? parseInt(watering) : 0,
                repotFrequency: repotting ? parseInt(repotting) : 0,
                pruneFrequency: pruning ? parseInt(pruning) : 0,
                state: status,
                image: imageUri ? imageUri : 'https://img.icons8.com/ios-filled/50/potted-plant.png',
                notes: notes,
                category: category || null,
            };

            if (plantToEdit) {
                await updatePlant(db, newPlant, false);
            } else {
                await insertPlant(db, newPlant);
            }

            resetForm();
            navigation.goBack();
        } catch (error) {
            console.error('Error: ', error);
            Alert.alert('Error, unable to save the plant!');
        }
    };

    const handleCancel = () => {
        resetForm();
        navigation.goBack();
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            const isoDate = selectedDate.toISOString().split('T')[0];
            setAcquisitionDate(isoDate);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const FormFields = () => (
        <>
            <View style={styles.row}>
                <View style={styles.inputGroup}>
                    <Text>Name*:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={(text) => /^[a-zA-ZÀ-ÿ0-9]*$/.test(text) && setName(text)}
                        maxLength={50}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text>Species*:</Text>
                    <TextInput
                        style={styles.input}
                        value={species}
                        onChangeText={(text) => /^[a-zA-ZÀ-ÿ\s]*$/.test(text) && setSpecies(text)}
                        maxLength={50}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text>Acquisition date*:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                    <Text style={{ color: acquisitionDate ? 'black' : 'gray' }}>
                        {acquisitionDate || 'Select a date'}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        maximumDate={new Date()}
                    />
                )}
            </View>

            <View style={styles.inputGroup}>
                <Text>Pruning frequency*:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={pruning}
                    onChangeText={setPruning}
                    maxLength={3}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text>Repotting frequency*:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={repotting}
                    onChangeText={setRepotting}
                    maxLength={3}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text>Watering frequency*:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={watering}
                    onChangeText={setWatering}
                    maxLength={3}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text>Plant status*:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={status} onValueChange={(itemValue) => setStatus(itemValue)}>
                        <Picker.Item label="Healthy" value={PlantState.Healthy} />
                        <Picker.Item label="To check" value={PlantState.ToCheck} />
                        <Picker.Item label="Sick" value={PlantState.Sick} />
                    </Picker>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text>Category:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={category} onValueChange={(value) => setCategory(value)}>
                        <Picker.Item label="No category" value={''} />
                        {categories.map((cat) => (
                            <Picker.Item label={cat} value={cat} key={cat} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text>Personal notes:</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    maxLength={750}
                />
            </View>
        </>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {isLandscape ? (
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ flex: 1 }}>
                        <Button title="Choose an image" onPress={pickImage} />
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 10, alignSelf: 'center' }} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.imageText}>No image selected</Text>
                            </View>
                        )}
                    </View>
                    <View style={{ flex: 1 }}>
                        {FormFields()}
                    </View>
                </View>
            ) : (
                <>
                    <Button title="Choose an image" onPress={pickImage} />
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginTop: 10, alignSelf: 'center' }} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.imageText}>No image selected</Text>
                        </View>
                    )}
                    {FormFields()}
                </>
            )}

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.buttonText}>❌</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>✔️</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddPlantScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    imagePlaceholder: {
        backgroundColor: '#ccc',
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    imageText: {
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputGroup: {
        marginBottom: 12,
        flex: 1,
        marginHorizontal: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 6,
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingBottom: 40,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 12,
        borderRadius: 30,
        width: 60,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 30,
        width: 60,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: '#fff',
    },
});
