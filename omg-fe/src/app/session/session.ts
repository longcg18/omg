import { Item } from "../item/item";


export interface Session {
    id: number | 0;
    startTime: string;
    closeTime: string;

    initiatePrice: number;
    reversePrice: number;
    stepPrice: number;
    currentPrice: number;

    item: Item;
}