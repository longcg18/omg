import { Item } from "../item/item";


export interface User {
    username: string;
    password: string;
    name: string;
    email: string;

    role: number;
    items: Item[];
}