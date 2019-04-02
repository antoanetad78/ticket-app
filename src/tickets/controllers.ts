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
    // NotFoundError, 
    // ForbiddenError, 
    // Get, 
    // Patch 
  } from 'routing-controllers'

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
}