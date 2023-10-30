import { Timestamp } from "rxjs";

export interface Item{
    id: number | 0;
    plateNumber: string;
    likes: number;
    time: string;
}