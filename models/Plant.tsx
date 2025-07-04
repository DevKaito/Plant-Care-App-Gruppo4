export enum PlantState {
    Healthy = "Healthy",
    Sick = "Sick",
    ToCheck = "To Check"
}

export interface Plant{
    key: number;
    name?: string;
    species: string;
    ownedSince: Date;
    waterFrequency: number;
    image?: string;
    state: PlantState;
}