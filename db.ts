import { Category } from './models/Category';
import { Plant, PlantState } from './models/Plant';
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getConnection = async(): Promise<SQLite.SQLiteDatabase> =>{
    try{
        if(!db) {
            db = SQLite.openDatabaseSync('db.db');
        }
        return db;
    } catch (error) {
        console.error('Error opening database:', error);
        throw error;
    }  
}

export const createPlantsTable = async (db: SQLite.SQLiteDatabase) => {
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
        notes TEXT,
        waterCountdown INTEGER,
        repotCountdown INTEGER,
        pruneCountdown INTEGER,
        category TEXT
    );
  `);
};

export const createCategoriesTable = async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
        name TEXT PRIMARY KEY
    );
  `);
}

export const insertPlant = async (db: SQLite.SQLiteDatabase, plant: Omit<Plant, 'key'>) => {
    const insertPlantQuery = 'INSERT INTO plants (name, species, acquireDate, pruneFreq, repotFreq, waterFreq, status, image, notes, waterCountdown, repotCountdown, pruneCountdown, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [plant.name, plant.species, plant.ownedSince.toDateString(), plant.waterFrequency, plant.repotFrequency, plant.pruneFrequency, plant.state.toString(), plant.image, plant.notes, plant.waterFrequency, plant.repotFrequency, plant.pruneFrequency, plant.category];
    await db.runAsync(insertPlantQuery, params);
};

export const insertCategory = async (db: SQLite.SQLiteDatabase, name: string) => {
    const insertCategoryQuery = 'INSERT INTO categories(name) VALUES (?)';
    const params = [name];
    await db.runAsync(insertCategoryQuery, params);
}

export const updatePlant = async (db: SQLite.SQLiteDatabase, plant: Plant, cure: boolean) => {
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
        notes = ?,
        waterCountdown = ?,
        repotCountdown = ?,
        pruneCountdown = ?,
        category = ?
    WHERE id = ?
  `;
    let params = [];
    if(!cure){
        params = [
            plant.name,
            plant.species,
            plant.ownedSince.toISOString(),
            plant.waterFrequency,
            plant.repotFrequency,
            plant.pruneFrequency,
            plant.state,
            plant.image,
            plant.notes,
            plant.waterFrequency,
            plant.repotFrequency,
            plant.pruneFrequency,
            plant.category,
            plant.key
        ];
    }
    else{
        params = [
            plant.name,
            plant.species,
            plant.ownedSince.toISOString(),
            plant.waterFrequency,
            plant.repotFrequency,
            plant.pruneFrequency,
            PlantState.Healthy,
            plant.image,
            plant.notes,
            plant.waterFrequency,
            plant.repotFrequency,
            plant.pruneFrequency,
            plant.category,
            plant.key
        ];
    }
    
    await db.runAsync(updateQuery, params);
};

export const updateCategory = async (db: SQLite.SQLiteDatabase, oldName: string, newName: string) =>{
    const updateCategoryQuery = 'UPDATE categories SET name = ? WHERE name = ?'
    const params = [newName, oldName];
    await db.runAsync(updateCategoryQuery, params);
}

export const deletePlant = async (db: SQLite.SQLiteDatabase, id: number) => {
    const deleteQuery = 'DELETE FROM plants WHERE id = ?';
    await db.runAsync(deleteQuery, [id]);
};

export const deleteCategories = async (db: SQLite.SQLiteDatabase, names: string[]) => {
    console.log(names)
    names.forEach(async (name) => {
        console.log("Cancellando la categoria", name)
        const deleteCategoryQuery = 'DELETE FROM categories WHERE name = ?'
        const params = [name];
        await db.runAsync(deleteCategoryQuery, params);
    })
    console.log("Categorie rimaste", await getCategories(db));
}

//Utils only
export const deleteAllPlants = async (db: SQLite.SQLiteDatabase) => {
    const deleteQuery = 'DELETE FROM plants';
    await db.runAsync(deleteQuery);
};

//Utils only
export const deletePlantsTable = async (db: SQLite.SQLiteDatabase) => {
    const dropQuery = 'DROP TABLE IF EXISTS plants';
    await db.runAsync(dropQuery);
}

export const getPlants = async (db:SQLite.SQLiteDatabase): Promise<Plant[]> => {
    if(db){
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
                image: row.image,
                state: row.status as PlantState,
                notes: row.notes ? row.notes : '',
                category: row.category
            };
            plants.push(plant);
            console.log(plant, row.waterCountdown, row.repotCountdown, row.pruneCountdown);
        })
        return plants;
    }
    else{
        throw new Error('Database connection is not established');
    }
    
}

export const getRecentPlants = async (db: SQLite.SQLiteDatabase): Promise<Plant[]> => {
    if(db){
        const selectQuery = 'SELECT * FROM plants ORDER BY ID DESC LIMIT 3';
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
                image: row.image,
                state: row.status as PlantState,
                notes: row.notes ? row.notes : '',
                category: row.category
            }
            plants.push(plant);
        })
        return plants;
    }
    else{
        throw new Error('Database connection is not established');
    }
}

export const getCurablePlants = async (db: SQLite.SQLiteDatabase): Promise<Plant[]> => {
    const selectQuery = `SELECT p.*
    FROM plants AS p
    WHERE p.status = 'To Check' OR p.status = 'Sick';
    `
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
            image: row.image,
            state: row.status as PlantState,
            notes: row.notes ? row.notes : '',
            category: row.category
        };
        plants.push(plant);
    });
    return plants;
}

export const updateCountdownsAndStatus = async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync(`
        UPDATE plants
        SET
        waterCountdown = CASE WHEN waterCountdown > 0 THEN waterCountdown - 1 ELSE 0 END,
        repotCountdown = CASE WHEN repotCountdown > 0 THEN repotCountdown - 1 ELSE 0 END,
        pruneCountdown = CASE WHEN pruneCountdown > 0 THEN pruneCountdown - 1 ELSE 0 END
    `);

    await db.execAsync(`
        UPDATE plants
        SET status = 'To Check'
        WHERE waterCountdown = 0 OR repotCountdown = 0 OR pruneCountdown = 0
    `);
    await db.execAsync(`
        UPDATE plants
        SET status = 'Sick'
        WHERE waterCountdown = 0 AND repotCountdown = 0 AND pruneCountdown = 0
    `);
    await db.execAsync(`
        UPDATE plants
        SET status = 'Healthy'
        WHERE waterCountdown > 0 AND repotCountdown > 0 AND pruneCountdown > 0
    `);
};

export const getCategories = async(db: SQLite.SQLiteDatabase): Promise<string[]> => {
    const selectQuery = 'SELECT name FROM categories'
    const results = await db.getAllAsync(selectQuery);
    const categories: string[] = [];

    results.map((row: any) => {
        categories.push(row.name);
    })
    return categories;
}
