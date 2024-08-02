// src/entities/OrderItem.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './product.entity';
import { orderItems } from './orderItems.entity';
import { User } from './user.entity';


@Entity()
export class Orders {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(() => Product)
    product: Product;

    @ManyToOne(() => Orders, order => order.order)
    order: Orders;

    @OneToMany(() => orderItems, orderItem => orderItem.order)
    orderItems: orderItems[];

    @ManyToOne(() => User, user => user.orders)
    user: User;
}
