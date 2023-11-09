import { Item } from "../item/item";


export interface User {
    username: string;
    password: string;
    
    name: string;
    email: string;
    address: string;
    birthday: Date;
    phone: number;


    role: number;
    items: Item[];
}