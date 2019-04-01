import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
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

    @Column('image', {nullable: true})
    picture: ImageBitmapSource

    @IsNumber()
    @Column('number', {nullable: false})
    price: number
   

    //relations
    @ManyToOne(_=> User, user=>user.tickets, {eager:true})
    user: User

    @ManyToOne(_=> Event, event=>event.tickets, {eager:true})
    event: Event

    @OneToMany(_=> Comment, comment=>comment.ticket, {eager:true})
    comment: Comment[]
}