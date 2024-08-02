

import { BaseEntity, CreateDateColumn, Generated, TableInheritance } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { IsNull } from "typeorm";
import { Entity,Column, PrimaryGeneratedColumn } from "typeorm";


export abstract  class Common { 
    @PrimaryGeneratedColumn()
    id:string

    
    // @Column({ unique: true, nullable: false })
    //  uuid: string;
    
    @Column({type:"enum",enum:["active","inActive"],default:'active'})
    status:string
    
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
   
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at:Date
}