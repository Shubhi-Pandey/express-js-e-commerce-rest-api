// src/entities/Order.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Orders } from './order.entity';



@Entity()
export class orderItems {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => orderItems, orderItem => orderItem.orderItems)
    orderItems: orderItems[];

    @ManyToOne(() => Orders, order => order.orderItems) // Correcting the relationship definition
    order: Orders;

    @Column()
    shippingAddress1: string;

    @Column()
    shippingAddress2: string;

    @Column()
    city: string;

    @Column()
    zip: string;

    @Column()
    country: string;

    @Column()
    phone: string;

    @Column()
    status: string;

    @Column()
    totalPrice: number;

    @ManyToOne(() => User, user => user.orders)
    user: User;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    dateOrdered: Date;
    // other columns and relationships as needed

    
}
