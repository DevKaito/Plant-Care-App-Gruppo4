export enum PlantState{
    Healthy = 'Healthy', 
    ToCheck = 'To Check', 
    Sick = 'Sick'
}

export interface Plant {
    key: number;
    name: string;
    species: string;
    ownedSince: Date;
    waterFrequency: number;
    repotFrequency: number;
    pruneFrequency: number;
    image: string;
    state: PlantState;
    notes: string;
    category: string | null;
}