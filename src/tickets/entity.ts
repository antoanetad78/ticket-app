import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn} from 'typeorm'
import { IsString, IsNumber } from 'class-validator';
import User from '../users/entity';
import Event from '../events/entity' 
import Comment from '../comments/entity';

@Entity()
export default class Ticket extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number

    @IsString()
    @Column('text')
    description: string

    @Column('text', {nullable: true})
    picture: string

    @IsNumber()
    @Column('float', {nullable: false})
    price: number

    @CreateDateColumn({nullable:false})
    createdAt: Date
   

    //relations
    @ManyToOne(()=> User, user=>user.tickets)
    user: User

    @ManyToOne(()=> Event, event=>event.tickets)
    event: Event
    name: "event_id"

    @OneToMany(() => Comment, comment=>comment.ticket)
    comment: Comment[]
}

