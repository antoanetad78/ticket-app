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
    // Params,
    // NotFoundError,
    // ForbiddenError, 
    // Get, 
    // Patch 
  } from 'routing-controllers'
import {getManager} from 'typeorm'


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
            const manager = getManager()
            const getTickets = await manager.query(`select * from tickets where event_id=${id}`)
            return getTickets
         }   

    @Get('/events/:eventId/tickets/:ticketId')
        async getTicketDetails(
            @Param('eventId') eventId: number,
            @Param('ticketId') ticketId: number
        )  {
            const manager = getManager()

            const getTicket = await manager.query(`select * from tickets where event_id=${eventId} and id=${ticketId}`)
            return getTicket 
        }  
}