import { Item } from 'src/item/item.entity';
import { User } from 'src/user/user.entity';
import {
    Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp
} from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    status: number;

    @Column({nullable: true})
    price: number;

    @OneToOne(() => Item, (item) => item.order)
    @JoinColumn()
    item!: Item;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn()
    user: User;
}