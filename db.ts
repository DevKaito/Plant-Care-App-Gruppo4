import {Plant, PlantState} from './models/Plant';
import * as SQLite from 'expo-sqlite';

export const getConnection = async() =>{
    return SQLite.openDatabaseAsync('db.db');
}

export const createTable = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      species TEXT,
      acquireDate TEXT,
      waterFreq INTEGER,
      repotFreq INTEGER,
      pruneFreq INTEGER,
      status TEXT,
      image TEXT
    );
  `);
};

export const insertPlant = async (db: SQLite.SQLiteDatabase, plant: Omit<Plant, 'key'>) => {
    const insertQuery = 'INSERT INTO plants (name, species, acquireDate, pruneFreq, repotFreq, waterFreq, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [plant.name, plant.species, plant.ownedSince.toDateString(), plant.waterFrequency, plant.repotFrequency, plant.pruneFrequency, plant.state, plant.image];
    await db.runAsync(insertQuery, params);
}

export const deletePlant = async (db: SQLite.SQLiteDatabase, id: number) => {
    const deleteQuery = 'DELETE FROM plants WHERE id = ?';
    await db.runAsync(deleteQuery, [id]);
}

export const deleteAllPlants = async (db: SQLite.SQLiteDatabase) => {
    const deleteQuery = 'DELETE FROM plants';
    await db.runAsync(deleteQuery);
}

export const getPlants = async (db:SQLite.SQLiteDatabase): Promise<Plant[]> => {
    const selectQuery = 'SELECT * FROM plants';
    const results = await db.getAllAsync(selectQuery);
    const plants: Plant[] = [];
    
    if(results.length < 1) {
        return plants;
    }

    results.map((row: any) => {
        const plant: Plant = {
            key: row.id,
            name: row.name,
            species: row.species,
            ownedSince: new Date(row.acquireDate),
            waterFrequency: row.waterFreq,
            repotFrequency: row.repotFreq,
            pruneFrequency: row.pruneFreq,
            image: row.image ? row.image : '../assets/placeholder.png',
            state: row.status ? row.status as PlantState : PlantState.Healthy
        };
        plants.push(plant);
    })
    console.log(plants);
    return plants;
}