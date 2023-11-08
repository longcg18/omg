import { Item } from "../item/item";
import { User } from "../user/user";

export interface Order {

    status: string;
    price: number;

    item: Item;
    user: User;
}