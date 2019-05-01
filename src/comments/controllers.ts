import Comment from './entity'
import User from '../users/entity'
import Ticket from '../tickets/entity'
import { 
    JsonController, 
    Authorized,
    Post, 
    Param, 
    HttpCode,
    Body,
    CurrentUser,
  } from 'routing-controllers'

@JsonController()
export default class CommentController {
    @Authorized()
    @Post('/events/:eventId/tickets/:ticketId/comments')
    @HttpCode(201)
        async createComment(
            @CurrentUser() user: User,
            @Param('ticketId') ticketId : number,
            @Body() data: Comment
        ) {
            const ticket = await Ticket.findOne(ticketId)
            const comment = await Comment.create({
                ...data,
                user,
                ticket
            }).save()

            return comment
        }

}