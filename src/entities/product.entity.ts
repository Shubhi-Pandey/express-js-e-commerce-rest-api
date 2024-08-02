import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Common } from "./common.entity";
import { Category } from "./category.entity";
import { Orders } from "./order.entity";


@Entity()
export class Product extends Common{
    @Column({length:200})
    name:string
    
    @Column()
    description :string
      
    @Column({default:''})
    richDescription:  string
    

    @Column()
    image:string
    
    images: [{
        type: String
    }]

    @Column({default:''})
    brand: string

    @Column({default:0})
    price:number

    // @ManyToOne(() => Category, category => category.products, { eager: true, nullable: false })
    // @JoinColumn({ name: 'categoryId' }) // Specify the foreign key column name if needed
    // category: Category;

    @Column()
    countInStock: number

    @Column({default:0})
    rating: string

    @Column({default:0})
    numReviews: number

    @Column({default:false})
    isFeatured: boolean

   
}