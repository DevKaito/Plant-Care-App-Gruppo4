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

    const countByCategory = (): { [category: string]: number } => {
    const counts: { [category: string]: number } = {};
    plants.forEach(p => {
        const category = (p.category && p.category.trim()) ? p.category.trim() : 'With no Category';
        counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
};

const categoryCounts = countByCategory();
const categoryEntries = Object.entries(categoryCounts);
const total = plants.length;

const categoryPieData = categoryEntries.map(([category, count], i) => {
    const percentage = ((count / total) * 100).toFixed(0);
    const label = categoryEntries.length === 1
        ? `${category} - ${percentage}%`
        : category;

    return {
        name: label,
        count,
        color: ['#3F51B5', '#009688', '#FFC107', '#E91E63', '#9C27B0'][i % 5],
        legendFontColor: '#333',
        legendFontSize: 10.5,
    };
}).filter(item => item.count > 0);


    const pieData = [
        { name: 'Healthy plants', count: countByStatus('Healthy'), color: '#4CAF50', legendFontColor: '#333', legendFontSize: 12 },
        { name: 'Plants to check', count: countByStatus('To Check'), color: '#FF9800', legendFontColor: '#333', legendFontSize: 12 },
        { name: 'Sick plants', count: countByStatus('Sick'), color: '#F44336', legendFontColor: '#333', legendFontSize: 12 },
    ].filter(item => item.count > 0);

    const screenWidth = Dimensions.get('window').width - 32;

    return (
        <View style={styles.container}>
            
            <Text style={styles.plantNumberText}>Total number of plants: {plants.length}</Text>
            
            {categoryPieData.length > 0 ? (
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Distribution by Category</Text>
                    <PieChart
                        data={categoryPieData.map(({ name, count, color, legendFontColor, legendFontSize }) => ({
                            name,
                            population: count,
                            color,
                            legendFontColor,
                            legendFontSize,
                        }))}
                        width={screenWidth}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: 'white',
                            backgroundGradientTo: 'white',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor='population'
                        backgroundColor='transparent'
                        paddingLeft='0'
                    />
                </View>
            ) : (
                <Text style={{ marginTop: 16, fontStyle: 'italic' }}>No plant data available</Text>
            )}

            {pieData.length > 0 ? (
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Distribution by Status</Text>
                    <PieChart
                        data={pieData.map(({ name, count, color, legendFontColor, legendFontSize }) => ({
                            name,
                            population: count,
                            color,
                            legendFontColor,
                            legendFontSize,
                        }))}
                        width={screenWidth}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: 'white',
                            backgroundGradientTo: 'white',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor='population'
                        backgroundColor='transparent'
                        paddingLeft='0'
                    />
                </View>
            ) : (
                <Text style={{ marginTop: 16, fontStyle: 'italic' }}>No plant data available</Text>
            )}

        </View>

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
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
        alignSelf: 'center',
    },
});
