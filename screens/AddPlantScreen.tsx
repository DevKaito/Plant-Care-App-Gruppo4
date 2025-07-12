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
} from 'react-native';
import { insertPlant, updatePlant, getConnection, getCategories } from '../db';
import { Plant, PlantState } from '../models/Plant';
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

    const[categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const loadCategories = async() => {
            const db = await getConnection();
            const categories = await getCategories(db);
            setCategories(categories);
        }
        loadCategories();

        if (plantToEdit) {
            setName(plantToEdit.name || '');
            setSpecies(plantToEdit.species || '');
            setAcquisitionDate(plantToEdit.ownedSince? new Date(plantToEdit.ownedSince).toISOString().split('T')[0] : '');
            setPruning(String(plantToEdit.pruneFrequency || ''));
            setRepotting(String(plantToEdit.repotFrequency || ''));
            setWatering(String(plantToEdit.waterFrequency || ''));
            setStatus(plantToEdit.state);
            setNotes(plantToEdit.notes || '');
            setImageUri(plantToEdit.image || null);
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
    };

    const handleSave = async () => {

        if (!name.trim() || !species.trim() || !acquisitionDate || !watering || !repotting || !pruning) {
            Alert.alert('Errore', 'Compila tutti i campi obbligatori! (*)');
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
                category: category ? category : ''
            };

            if (plantToEdit) {
                await updatePlant(db, newPlant, false);
            } else {
                await insertPlant(db, newPlant);
            }

            resetForm();
            navigation.goBack();
        } catch (error) {
            console.error('Errore: ', error);
            Alert.alert('Errore, impossibile salvare la pianta!');
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Button title="Scegli immagine" onPress={pickImage} />

            {imageUri ? (
                <Image
                    source={{ uri: imageUri }}
                    style={{ width: 200, height: 200, marginTop: 10, alignSelf: 'center' }}
                />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.imageText}>Nessuna immagine selezionata</Text>
                </View>
            )}

            <View style={styles.row}>
                <View style={styles.inputGroup}>
                    <Text>Nome*:</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={(text) => {
                            if (/^[a-zA-ZÀ-ÿ0-9]*$/.test(text)) {
                                setName(text);
                            }
                        }}
                        maxLength={50}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text>Specie*:</Text>
                    <TextInput
                        style={styles.input}
                        value={species}
                        onChangeText={(text) => {
                            if (/^[a-zA-ZÀ-ÿ\s]*$/.test(text)) {
                                setSpecies(text);
                            }
                        }}
                        maxLength={50}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text>Data acquisizione*:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                    <Text style={{ color: acquisitionDate ? 'black' : 'gray' }}>
                        {acquisitionDate || 'Seleziona una data'}
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
                <Text>Frequenza potatura*:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={pruning}
                    onChangeText={setPruning}
                    maxLength={3}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text>Frequenza rinvaso*:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={repotting}
                    onChangeText={setRepotting}
                    maxLength={3}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text>Frequenza innaffiatura*:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={watering}
                    onChangeText={setWatering}
                    maxLength={3}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text>Stato della pianta*:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={status} onValueChange={(itemValue) => setStatus(itemValue)}>
                        <Picker.Item label="Sana" value={PlantState.Healthy} />
                        <Picker.Item label="Da controllare" value={PlantState.ToCheck} />
                        <Picker.Item label="Malata" value={PlantState.Sick} />
                    </Picker>
                </View>
            </View>
            <View style={styles.inputGroup}>
                <Text>Categoria:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={category} onValueChange={(value) => setCategory(value)}>
                        <Picker.Item label="Nessuna categoria" value={''}/>
                        {categories.map((cat) => (
                            <Picker.Item label={cat} value={cat} key={cat} />
                        ))}
                    </Picker>
                </View>
            </View>
            <View style={styles.inputGroup}>
                <Text>Note personali:</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    maxLength={750}
                />
            </View>

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
        marginBottom: 20,
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
