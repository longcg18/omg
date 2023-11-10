import { User } from "../user/user";

export interface Item{
    id: number | 0;
    plateNumber: string;
    type: string;
    ownershipNumber: string;

    vendor: string;
    status: string;
    owner: User;
}