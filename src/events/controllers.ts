import Event from './entity'
import { 
    JsonController, 
    Authorized, 
    Post, 
    // BadRequestError, 
    HttpCode,
    Body,
    Get,
    Param, 
    QueryParam,
    NotFoundError,
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

        @Get('/events')
        @HttpCode(200)
            getEvents(
                @QueryParam('page')page:number,
                @QueryParam('size')size: number
                )
                {
                return Event.find({
                    skip:page,
                    take:size
                })
            }  
        
        @Get('/events/:id')
        @HttpCode(200)
            getOneEvent(
                @Param('id') id: number
            ){
                if(!id){
                    return NotFoundError
                }
                
                return Event.findOne(id)
            }    
    }
