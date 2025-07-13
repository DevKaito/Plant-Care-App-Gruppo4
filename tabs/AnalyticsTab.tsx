import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
import { getConnection, getPlants } from '../db';
import { Plant } from '../models/Plant';
import { PieChart } from 'react-native-chart-kit';
import { useIsFocused } from '@react-navigation/native';

const AnalysisTab = () => {
    const [plants, setPlants] = useState<Plant[]>([]);
    const isFocused = useIsFocused();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

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

    const countByStatus = (status: string) =>
        plants.filter((p) => p.state === status).length;

    const countByCategory = (): { [category: string]: number } => {
        const counts: { [category: string]: number } = {};
        plants.forEach((p) => {
            const category =
                p.category && p.category.trim() ? p.category.trim() : 'With no Category';
            counts[category] = (counts[category] || 0) + 1;
        });
        return counts;
    };

    const categoryCounts = countByCategory();
    const categoryEntries = Object.entries(categoryCounts);
    const total = plants.length;

    const categoryPieData = categoryEntries
        .map(([category, count], i) => {
            const percentage = ((count / total) * 100).toFixed(0);
            const label =
                categoryEntries.length === 1 ? `${category} - ${percentage}%` : category;

            return {
                name: label,
                count,
                color: ['#3F51B5', '#009688', '#FFC107', '#E91E63', '#9C27B0'][i % 5],
                legendFontColor: '#333',
                legendFontSize: isLandscape ? 10 : 12,
            };
        })
        .filter((item) => item.count > 0);

    const pieData = [
        {
            name: 'Healthy plants',
            count: countByStatus('Healthy'),
            color: '#4CAF50',
            legendFontColor: '#333',
            legendFontSize: isLandscape ? 10 : 12,
        },
        {
            name: 'Plants to check',
            count: countByStatus('To Check'),
            color: '#FF9800',
            legendFontColor: '#333',
            legendFontSize: isLandscape ? 10 : 12,
        },
        {
            name: 'Sick plants',
            count: countByStatus('Sick'),
            color: '#F44336',
            legendFontColor: '#333',
            legendFontSize: isLandscape ? 10 : 12,
        },
    ].filter((item) => item.count > 0);

    const chartWidth = isLandscape ? width / 2 - 40 : width - 32;
    const chartHeight = isLandscape ? 180 : 220;

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text
                style={[
                    styles.title,
                    { fontSize: isLandscape ? 18 : 22 },
                ]}
            >
                Total number of plants: {plants.length}
            </Text>

            <View
                style={[
                    styles.chartRow,
                    isLandscape ? styles.rowLandscape : styles.rowPortrait,
                ]}
            >
                {categoryPieData.length > 0 && (
                    <View style={[styles.chartBox, { width: chartWidth }]}>
                        <Text
                            style={[
                                styles.chartTitle,
                                { fontSize: isLandscape ? 14 : 16 },
                            ]}
                        >
                            Distribution by Category
                        </Text>
                        <PieChart
                            data={categoryPieData.map((item) => ({
                                name: item.name,
                                population: item.count,
                                color: item.color,
                                legendFontColor: item.legendFontColor,
                                legendFontSize: item.legendFontSize,
                            }))}
                            width={chartWidth}
                            height={chartHeight}
                            chartConfig={{
                                backgroundGradientFrom: 'white',
                                backgroundGradientTo: 'white',
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="10"
                        />
                    </View>
                )}

                {pieData.length > 0 && (
                    <View style={[styles.chartBox, { width: chartWidth }]}>
                        <Text
                            style={[
                                styles.chartTitle,
                                { fontSize: isLandscape ? 14 : 16 },
                            ]}
                        >
                            Distribution by Status
                        </Text>
                        <PieChart
                            data={pieData.map((item) => ({
                                name: item.name,
                                population: item.count,
                                color: item.color,
                                legendFontColor: item.legendFontColor,
                                legendFontSize: item.legendFontSize,
                            }))}
                            width={chartWidth}
                            height={chartHeight}
                            chartConfig={{
                                backgroundGradientFrom: 'white',
                                backgroundGradientTo: 'white',
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="10"
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default AnalysisTab;

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
        backgroundColor: 'white',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 12,
    },
    chartRow: {
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    rowPortrait: {
        flexDirection: 'column',
    },
    rowLandscape: {
        flexDirection: 'row',
    },
    chartBox: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 12,
        padding: 8,
        marginBottom: 16,
    },
    chartTitle: {
        fontWeight: '600',
        alignSelf: 'center',
        marginBottom: 6,
    },
});
