
import { BaseEntity, CreateDateColumn, OneToMany } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { IsNull } from "typeorm";
import { Entity,Column, PrimaryGeneratedColumn } from "typeorm";
import { Common } from "./common.entity";
import { Orders } from "./order.entity";
import { orderItems } from "./orderItems.entity";

@Entity()
export class User extends Common{
  
    @Column({length:200})
    name:string
    
    @Column({length:255})
    email:string

    @Column()
    passwordHash:string

    @Column({length:12})
    phone:string

    @Column({default:false})
    isAdmin:string

    @Column({default:''})
    street:string

    @Column()
    apartment:string

    @Column()
    zip:string

    @Column()
    city:string

    @Column()
    country:string
    
    @OneToMany(() => orderItems, order => order.user)
    orders: orderItems[];
}