import {
    Column, Entity, PrimaryGeneratedColumn, Timestamp
} from 'typeorm';

@Entity() 
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50, default: '00A0-00000'})
    plateNumber: string;

    @Column({default: 0})
    likes: number;

    @Column({type: 'timestamp'})
    time: Timestamp;
}