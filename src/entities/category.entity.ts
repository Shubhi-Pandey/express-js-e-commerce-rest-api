import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Common } from "./common.entity";
import { Product } from "./product.entity";
@Entity()
export class Category extends Common{
     @Column({length:100})
     name:string

     @Column()
     icon:string

     @Column()
     color:string

     // @OneToMany(() => Product, product => product.category)
     // products: Product[]; // This creates the inverse side of the relationship
}