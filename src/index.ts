import "reflect-metadata"; // this shim is required
import {createExpressServer, Action, BadRequestError} from "routing-controllers";
import {verify} from './jwt'
import setupDb from './db'
import UserController from './users/controllers';
import LoginController from './login/controller';
import EventController from './events/controllers'
import User from './users/entity';
import TicketController from './tickets/controllers';
import CommentController from './comments/controllers';

const port = process.env.PORT || 3000

const app = createExpressServer({
  cors:true,
    controllers:[
      UserController,
      LoginController,
      EventController,
      TicketController,
      CommentController
    ],
    authorizationChecker: (action: Action) => {
      const header: string = action.request.headers.authorization
      if (header && header.startsWith('Bearer ')) {
        const [ , token ] = header.split(' ')
  
        try {
          return !!(token && verify(token))
        }
        catch (e) {
          throw new BadRequestError(e)
        }
      }
  
      return false
    },
    currentUserChecker: async (action: Action) => {
      const header: string = action.request.headers.authorization
      if (header && header.startsWith('Bearer ')) {
        const [ , token ] = header.split(' ')
        
        if (token) {
          const {id} = verify(token)
          return User.findOne(id)
        }
      }
      return undefined
    }
})

setupDb()
  .then(_ => {
    app.
    listen(port)
    console.log(`Listening on port ${port}`)
  })
  .catch(err => console.error(err))


