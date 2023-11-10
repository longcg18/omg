import { Item } from "../item/item";
import { Session } from "../session/session";
import { Transaction } from "../transaction/transaction";


export interface User {
    id: number;
    username: string;
    password: string;
    
    name: string;
    email: string;
    address: string;
    birthday: Date;
    phone: string;


    role: number;
    items: Item[];
    transaction: Transaction[];
    session: Session[];
}