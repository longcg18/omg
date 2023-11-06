import { Session } from "../session/session";
import { User } from "../user/user";

export interface Transaction {
    id: number;
    money: number;

    created_at: Date;
    user: User;
    session: Session;
}