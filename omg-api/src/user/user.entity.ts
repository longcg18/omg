import { Item } from 'src/item/item.entity';
import { Order } from 'src/order/order.entity';
import { Session } from 'src/session/session.entity';
import { Transaction } from 'src/transaction/transaction.entity';
import {
    Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    username: string;
    
    @Column({nullable: false})
    password: string;

    @Column({nullable: true, charset: 'utf8', collation: 'utf8_general_ci'})
    name: string;

    @Column({nullable: true})
    phoneNumber: string;

    @Column({nullable: true})
    email: string;

    @Column({default: 1})
    role: number; // 0 - admin , 1 - user

    @Column({nullable: true})
    birthday: Date;

    @Column({nullable: true})
    phone: string;

    @Column({nullable: true, charset: 'utf8', collation: 'utf8_general_ci'})
    address: string;

    @OneToMany(() => Item, (item) => item.owner) 
    @JoinColumn()
    items: Item[];

    @OneToMany(() => Session, (session) => session.winner) 
    @JoinColumn()
    sessionWon: Session[];

    @OneToMany(() => Transaction, (transaction) => transaction.user) 
    @JoinColumn()
    transactions: Transaction[];

    @OneToMany(() => Order, (order) => order.user) 
    @JoinColumn()
    orders: Order[];
}