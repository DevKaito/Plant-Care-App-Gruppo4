import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import TabNavigator from './models/TabNavigator';
import { createTable, getConnection } from './db';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initDatabase = async () => {
      try{
        const db = await getConnection();
        await createTable(db);
        setDbReady(true);
        console.log('Database initialized successfully');
      }catch (error) {
        console.error('Error initializing database:', error);
      }
    }
    initDatabase();
  }, []);
  
  if (!dbReady) {
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
  }

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

