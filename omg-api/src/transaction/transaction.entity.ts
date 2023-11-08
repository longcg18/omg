import { Session } from 'src/session/session.entity';
import { User } from 'src/user/user.entity';
import {
    Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp
} from 'typeorm';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    money: number;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Timestamp;

    @ManyToOne(() => User, (user) => user.transactions)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Session, (session) => session.transactions)
    @JoinColumn()
    session: Session;
}