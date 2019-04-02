import { JsonController, 
    Post, 
    Param, 
    Get, 
    Body, 
    Authorized
 } from 'routing-controllers'
import User from './entity';
// import { create } from 'domain';

@JsonController()
export default class UserController{
    @Post('/users')
    async signup(
        @Body() data:User
    ) {
        const {password, ...rest} = data
    const entity = User.create(rest)
    await entity.setPassword(password)

    const user = await entity.save()
    console.log('User test');
    
    return user
    }

    @Authorized()
    @Get('/users/:id([0-9]+)')
    getUser(
      @Param('id') id: number
    ) {
      return User.findOne(id)
    }

    @Authorized()
    @Get('/users')
    allUsers() {
      return User.find()
    }
}





