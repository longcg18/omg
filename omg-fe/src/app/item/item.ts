export interface Item{
    id: number | 0;
    plateNumber: string;
    type: string;
    ownershipNumber: string;

    vendor: string | null;
    status: string | null;
}