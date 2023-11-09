import {
    Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Timestamp
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Order } from 'src/order/order.entity';
import { Session } from 'src/session/session.entity';
@Entity() 
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 10, default: '00A0-00000'})
    plateNumber: string;

    @Column({default: 0})
    likes: number;

    @Column({nullable: false, unique: true})
    ownershipNumber: string;

    @Column({default: 'Motorbike', charset: 'utf8', collation: 'utf8_general_ci'})
    type: string;

    @Column({default: 'Honda'})
    vendor: string;

    @Column({default: 'avaiable'})
    status: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Timestamp;

    @ManyToOne(() => User, (user) => user.items)
    @JoinColumn()
    public owner: User;

    @Column({nullable: true})
    ownerId: number;
    
    @OneToOne(() => Session, (session) => session.item) 
    @JoinColumn()
    session: Session;

    @OneToOne(() => Order, (order) => order.item) 
    @JoinColumn()
    order: Order;
}