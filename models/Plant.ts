export enum PlantState{
    'Healthy', 'To Check', 'Sick'
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
}
