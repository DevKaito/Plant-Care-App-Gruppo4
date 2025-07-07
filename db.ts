import { Plant, PlantState } from './models/Plant';
import * as SQLite from 'expo-sqlite';

export const getConnection = async () => {
    // Cambiare nome se necessario
    return SQLite.openDatabaseAsync('db.db');
};

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
      image TEXT,
      notes TEXT
    );
  `);
};

export const insertPlant = async (db: SQLite.SQLiteDatabase, plant: Omit<Plant, 'key'>) => {
    const insertQuery = `
    INSERT INTO plants 
      (name, species, acquireDate, waterFreq, repotFreq, pruneFreq, status, image, notes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const params = [
        plant.name,
        plant.species,
        plant.ownedSince.toISOString(),
        plant.waterFrequency,
        plant.repotFrequency,
        plant.pruneFrequency,
        plant.state,
        plant.image,
        plant.notes
    ];
    await db.runAsync(insertQuery, params);
};

export const updatePlant = async (db: SQLite.SQLiteDatabase, plant: Plant) => {
    const updateQuery = `
    UPDATE plants SET
      name = ?,
      species = ?,
      acquireDate = ?,
      waterFreq = ?,
      repotFreq = ?,
      pruneFreq = ?,
      status = ?,
      image = ?,
      notes = ?
    WHERE id = ?
  `;
    const params = [
        plant.name,
        plant.species,
        plant.ownedSince.toISOString(),
        plant.waterFrequency,
        plant.repotFrequency,
        plant.pruneFrequency,
        plant.state,
        plant.image,
        plant.notes,
        plant.key
    ];
    await db.runAsync(updateQuery, params);
};

export const deletePlant = async (db: SQLite.SQLiteDatabase, id: number) => {
    const deleteQuery = 'DELETE FROM plants WHERE id = ?';
    await db.runAsync(deleteQuery, [id]);
};

export const deleteAllPlants = async (db: SQLite.SQLiteDatabase) => {
    const deleteQuery = 'DELETE FROM plants';
    await db.runAsync(deleteQuery);
};

export const getPlants = async (db: SQLite.SQLiteDatabase): Promise<Plant[]> => {
    const selectQuery = 'SELECT * FROM plants';
    const results = await db.getAllAsync(selectQuery);
    const plants: Plant[] = [];

    if (results.length < 1) return plants;

    results.forEach((row: any) => {
        const plant: Plant = {
            key: row.id,
            name: row.name,
            species: row.species,
            ownedSince: new Date(row.acquireDate),
            waterFrequency: row.waterFreq,
            repotFrequency: row.repotFreq,
            pruneFrequency: row.pruneFreq,
            state: (['sana', 'controllare', 'malata'].includes(row.status) ? row.status : 'sana') as PlantState,
            image: row.image || '../assets/placeholder.png',
            notes: row.notes || ''
        };
        plants.push(plant);
    });

    return plants;
};

