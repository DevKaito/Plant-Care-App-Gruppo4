import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getConnection, getPlants } from '../db';
import { Plant } from '../models/Plant';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

const AnalysisTab = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            const fetchPlants = async () => {
                const db = await getConnection();
                const allPlants = await getPlants(db);
                setPlants(allPlants);
            };
        fetchPlants();
        }
    }, [isFocused]);

    const countByStatus = (status: string) => plants.filter(p => p.state === status).length;

    const pieData = [
        { name: 'Healthy plants', count: countByStatus('sana'), color: '#4CAF50', legendFontColor: '#333', legendFontSize: 12 },
        { name: 'Plants to check', count: countByStatus('controllare'), color: '#FF9800', legendFontColor: '#333', legendFontSize: 12 },
        { name: 'Sick plants', count: countByStatus('malata'), color: '#F44336', legendFontColor: '#333', legendFontSize: 12 },
    ].filter(item => item.count > 0);

    return (
        <View style={styles.container}>
            
            <Text style={styles.plantNumberText}>Total number of plants: {plants.length}</Text>
            
            {pieData.length > 0 ? (
                <View style={styles.chartContainer}>
                    <PieChart
                        data={pieData.map(({ name, count, color, legendFontColor, legendFontSize }) => ({
                            name,
                            population: count,
                            color,
                            legendFontColor,
                            legendFontSize,
                        }))}
                        width={Dimensions.get('window').width - 32}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: 'white',
                            backgroundGradientTo: 'white',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor='transparent'
                        paddingLeft='4'
                    />
                </View>
            ) : (
                <Text style={{ marginTop: 16, fontStyle: 'italic' }}>No plant data available</Text>
            )}

        </View>
        
        

        //Parte per distribuzione per tipologia/categoria.

        //Attività di cura eseguite (grafico mensile) <--- Istogramma.
        
    );
};

export default AnalysisTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    plantNumberText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
        marginLeft: 5,
    },
    chartContainer: {
        borderWidth: 3,
        borderRadius: 12,
        padding: 5,
        alignSelf: 'center',
        marginTop: 16,
    },
});
