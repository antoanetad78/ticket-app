import User from '../users/entity';
import Event from '../events/entity'
import Ticket from './entity'
import {
    JsonController, 
    Authorized, 
    // CurrentUser, 
    Post, 
    Param, 
    // BadRequestError, 
    HttpCode,
    Body,
    CurrentUser,
    Get,
    NotFoundError, 
    // ForbiddenError, 
    // Get, 
    // Patch 
  } from 'routing-controllers'
// import {createQueryBuilder} from 'typeorm'


@JsonController()
export default class TicketController {
    @Authorized()
    @Post('/events/:id/tickets')
    @HttpCode(201)
        async createTicket(
            @CurrentUser() user: User,
            @Param("id") eventID: Event,
            @Body() data: Ticket
        ) {
            const event = await Event.findOne(eventID)            
            const ticket  = await Ticket.create({
                ...data,
                user,
                event            
            }).save()
            return ticket
        }

    @Get('/events/:id/tickets')
        async getAllTickets(
            @Param('id') id: number
        ) {
            //A solution with Ticket.find({where:{event_id: id}}) did not work. The where is ignored. This solution required StrictNullCheck:false
            const event = await Event.findOne(id)
            if(event){
                const tickets = [...event.tickets]            
                return tickets
            }
            return NotFoundError
        }   
}