// import User from '../users/entity';
import Event from './entity'
import { 
    JsonController, 
    Authorized, 
    // CurrentUser, 
    Post, 
    // Param, 
    // BadRequestError, 
    HttpCode,
    Body, 
    // NotFoundError, 
    // ForbiddenError, 
    // Get, 
    // Body, 
    // Patch 
  } from 'routing-controllers'


@JsonController()
    export default class EventController {
        @Authorized()
        @Post('/events')
        @HttpCode(201)
            async createEvent(
                @Body() data: Event
            ) {
                console.log('Event Data test',data);
                
                const event  = await Event.create(data).save()
                return event
            }
    }
