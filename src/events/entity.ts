import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { IsString, IsDateString } from 'class-validator';
import Ticket from '../tickets/entity'

@Entity()
export default class Event extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number

    @IsString()
    @Column('text')
    name: string

    @IsString()
    @Column('text')
    description: string

    @Column('text', {nullable: true})
    picture: string

    @IsDateString()
    @Column('date', {nullable:true})
    startDate: Date

    @IsDateString()
    @Column('date', {nullable:true})
    endDate: Date

    @OneToMany(_ => Ticket, ticket=>ticket.event, {eager:true})
    tickets: Ticket[]

}