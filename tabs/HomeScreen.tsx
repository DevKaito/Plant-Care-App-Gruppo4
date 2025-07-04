import React from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, Image } from 'react-native';

const demoPlants = [
        { key: 1, name: 'Fern', species: 'Pteridophyta', ownedSince: new Date('2022-01-01'), waterFrequency: 7, image: require('../assets/placeholder.png'), state: 'Healthy' },
        { key: 2, name: 'Cactus', species: 'Cactaceae', ownedSince: new Date('2021-06-15'), waterFrequency: 14, image: require('../assets/placeholder.png'), state: 'Sick' },
        { key: 3, name: 'Bamboo', species: 'Poaceae', ownedSince: new Date('2020-03-10'), waterFrequency: 5, image: require('../assets/placeholder.png'), state: 'To Check' }
    ]

export default function HomeScreen(){
    const recentPlants = demoPlants.slice(0,3);
    
    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.title}>Ultime piante aggiunte</Text>
                <FlatList 
                    contentContainerStyle = {{flex:1, justifyContent: 'center', flexDirection: 'row'}}
                    data={demoPlants}
                    keyExtractor={item => item.key.toString()}
                    renderItem={({ item }) => (
                        <View style = {{padding: 10}}>
                            <Image source={item.image} style={styles.image} />
                            <Text>{item.name}</Text>
                            <Text>{item.species}</Text>
                        </View>
                    )}        
                />
            </View>
            <View style={styles.container}>
                <Text>Welcome to the Home Screen!</Text>
                <StatusBar />
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        //justifyContent: 'center',
    },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
    plantList: { gap: 12 },
    card: {
        width: 150,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        alignItems: 'center',
    },
    image: { width: 48, height: 48, borderRadius: 40, marginBottom: 8 },
    name: { fontWeight: 'bold', fontSize: 16 },
    species: { fontSize: 12, color: '#666' },
})