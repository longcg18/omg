import { Item } from "src/item/item.entity";
import { Transaction } from "src/transaction/transaction.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity()
export class Session {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'timestamp'})
    startTime: Timestamp;

    @Column({type: 'timestamp'})
    closeTime: Timestamp;

    @Column({nullable: true, type: 'bigint'})
    initiatePrice: number;

    @Column({nullable: true, type: 'bigint'})
    reversePrice: number;

    @Column({nullable: true, type: 'bigint'})
    stepPrice: number;

    @Column({type: 'bigint'})
    currentPrice: number;
    
    @Column({nullable: true})
    status: number;

    @ManyToOne(() => User, (user) => user.sessionWon) 
    @JoinColumn()
    winner: User;

    @OneToMany(() => Transaction, (transaction) => transaction.session)
    @JoinColumn()
    transactions: Transaction[];

    @OneToOne(() => Item, (item) => item.session) 
    @JoinColumn()
    item: Item;
}