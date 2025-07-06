import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const AddPlantScreen = () => {
    const navigation = useNavigation<any>();

    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [acquisitionDate, setAcquisitionDate] = useState('');
    const [pruning, setPruning] = useState('');
    const [repotting, setRepotting] = useState('');
    const [watering, setWatering] = useState('');
    const [status, setStatus] = useState('sana');
    const [notes, setNotes] = useState('');

    const resetForm = () => {
        setName('');
        setSpecies('');
        setAcquisitionDate('');
        setPruning('');
        setRepotting('');
        setWatering('');
        setStatus('sana');
        setNotes('');
    };

    const handleSave = () => {
        Alert.alert('Salvato', 'Pianta aggiunta con successo!');
        console.log({
            name,
            species,
            acquisitionDate,
            pruning,
            repotting,
            watering,
            status,
            notes,
        });

        resetForm();
        navigation.goBack();
    };

    const handleCancel = () => {
        resetForm();
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.imagePlaceholder}>
                <Text style={styles.imageText}>Card Title</Text>
                <Text style={styles.imageSub}>Secondary text</Text>
            </View>

            <View style={styles.row}>
                <View style={styles.inputGroup}>
                    <Text>Nome:</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} />
                </View>
                <View style={styles.inputGroup}>
                    <Text>Specie:</Text>
                    <TextInput style={styles.input} value={species} onChangeText={setSpecies} />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text>Data acquisizione:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={acquisitionDate}
                    onChangeText={setAcquisitionDate}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text>Frequenza potatura:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={pruning}
                    onChangeText={setPruning}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text>Frequenza rinvaso:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={repotting}
                    onChangeText={setRepotting}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text>Frequenza innaffiatura:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={watering}
                    onChangeText={setWatering}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text>Stato della pianta:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={status} onValueChange={(itemValue) => setStatus(itemValue)}>
                        <Picker.Item label="Sana" value="sana" />
                        <Picker.Item label="Da controllare" value="controllare" />
                        <Picker.Item label="Malata" value="malata" />
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
    imageSub: {
        color: '#444',
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
