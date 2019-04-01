import "reflect-metadata"; // this shim is required
import {createExpressServer} from "routing-controllers";
// import * as express from 'express'
import setupDb from './db'
import UserController from './users/controllers';

const port = process.env.PORT || 3000

const app = createExpressServer({
    controllers:[
      UserController
    ]
})

setupDb()
  .then(_ => {
    app.listen(port)
    console.log(`Listening on port ${port}`)
  })
  .catch(err => console.error(err))


