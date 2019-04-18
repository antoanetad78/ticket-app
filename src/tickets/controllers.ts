import User from '../users/entity';
import Event from '../events/entity'
import Ticket from './entity'
import {
    JsonController, 
    Authorized,
    Post, 
    Param,
    Body,
    CurrentUser,
    Get,
    NotFoundError,
    // Put,
    BadRequestError,
    Patch,
  } from 'routing-controllers'
import {getManager} from 'typeorm'

@JsonController()
export default class TicketController {
    @Authorized()
    @Post('/events/:id/tickets')
        async createTicket(
            @CurrentUser() user: User,
            @Param("id") eventID: number,
            @Body() data: Ticket
        ) {
            
            const event = await Event.findOne(eventID)   
            if(!event) return NotFoundError         
            const ticket  = await Ticket.create({
                ...data,
                event,
                user           
            }).save()
            return ticket
        }
    
    @Authorized()
    @Patch('/events/:eventId/tickets/:ticketId')
    async updateTicket(
        @CurrentUser() user: User,
        @Param('eventId') eventId: number,
        @Param('ticketId') ticketId: number,
        @Body() data: Ticket
    )  {
        const manager = getManager()

        const event = await Event.findOne(eventId)
        if(!event) return NotFoundError

        const getTicket = await manager.query(`select * from tickets where event_id=${eventId} and id=${ticketId}`)
            console.log(data);
            console.log(getTicket);
            console.log('Ticket user id ', getTicket[0].user_id);
            
            if(getTicket[0].user_id === user.id){
                let updatedTicket = await Ticket.update(getTicket[0].id, data)
                console.log("The updated ticket ",updatedTicket);
                updatedTicket = await manager.query(`select * from tickets where event_id=${eventId} and id=${ticketId}`)
                return updatedTicket
            }
            return BadRequestError
            
        }

    @Get('/events/:id/tickets')
        async getAllTickets(
            @Param('id') id: number
        ) {
            const manager = getManager()

            const event = await Event.findOne(id)
            if(!event) return NotFoundError
            const getTickets = await manager.query(`select * from tickets where event_id=${id}`)
            return getTickets
         }   

    @Get('/events/:eventId/tickets/:ticketId')
        async getTicketDetails(
            @Param('eventId') eventId: number,
            @Param('ticketId') ticketId: number
        )  {
            const manager = getManager()

            const event = await Event.findOne(eventId)
            if(!event) return NotFoundError

            const getTicket = await manager.query(`select * from tickets where event_id=${eventId} and id=${ticketId}`)
            const getComments = await manager.query(`select* from comments where ticket_id=${ticketId}`)
            const author = await manager.query(`select first_name, last_name from users where id=${getTicket[0].user_id}`)
            const countTickets = await manager.count(Ticket, {where:{user_id:getTicket[0].user_id}})
            const prices = await manager.query(`select price from tickets where event_id=${eventId}`)

            const sum = prices.reduce((acc, val)=>{
                const num = Object.values(val)
                acc = acc + num[0]
                return acc
            }, 0)
            const averagePrice = sum / prices.length

            console.log(averagePrice);
                   
            
            const risk = ()=>{
                const base = 5
                const max = 95
                const maxDeduction = 10
                const countComments = getComments.lenght
                const createdAt =  getTicket[0].created_at.getHours()
                const price = getTicket[0].price
                let risk = base
                if (countTickets === 1){
                    return risk +=10
                }

                if(countComments>3){
                    return risk +=5
                } 

                if (createdAt>9 && createdAt<17){
                    if(risk===base) return risk
                    return risk -=10
                } 

                if(createdAt<9 || createdAt>17) {
                    return risk +=10
                }

                if(price<averagePrice ){
                    const calc = ((averagePrice - price)/averagePrice)*100
                    return risk = risk+calc
                }

                if(price>averagePrice){
                    const calc = (-(averagePrice-price)/averagePrice)*100
                    if(risk === base) return risk
                    if(calc>maxDeduction && risk> 15) return risk-=maxDeduction
                    if(calc<=maxDeduction && risk>15) return risk-=calc
                }

                if(risk>max) return risk = max
                
                return risk

            }


            const ticketObject = getTicket.reduce((acc, val) => {
                //won't compile without this console.log!
                console.log(acc);
               return acc=val
            }, {})  

            const getTicketDetail = {...ticketObject,comments:getComments, author:author[0], risk}

            return  getTicketDetail
        }  
}