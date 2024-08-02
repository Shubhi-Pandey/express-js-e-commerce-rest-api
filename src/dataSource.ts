import {DataSource} from "typeorm"
import { User } from "./entities/user.entity"
import { Common } from "./entities/common.entity"
import { Category } from "./entities/category.entity"
import { Product } from "./entities/product.entity"
import { Orders } from "./entities/order.entity"
import { orderItems } from "./entities/orderItems.entity"



export const appDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "ecommerce-db",
    synchronize: true,
    logging: false,
    entities: [User,Category,Product,Orders,orderItems],
    subscribers: [],
    migrations: [],
})