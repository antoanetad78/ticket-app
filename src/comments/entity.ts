import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { IsString, MaxLength } from 'class-validator';
import Ticket from '../tickets/entity';
import User from '../users/entity';

@Entity()
export default class Comment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number

    @IsString()
    @MaxLength(150)
    @Column('text')
    text: string

    @ManyToOne(_=> Ticket, ticket=>ticket.comment, {eager:true})
    ticket: Ticket

    @ManyToOne(_=> User, user=>user.comments)
    user: User
}