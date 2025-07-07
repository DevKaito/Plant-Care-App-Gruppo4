export enum PlantState {
    Healthy = "Healthy",
    Sick = "Sick",
    ToCheck = "To Check"
}

export type Plant = {
    key: number;
    name: string;
    species: string;
    ownedSince: Date;
    waterFrequency: number;
    repotFrequency: number;
    pruneFrequency: number;
    image: string;
    state: PlantState;
}