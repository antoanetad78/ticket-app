import "reflect-metadata"; // this shim is required
import {createExpressServer} from "routing-controllers";
// import * as express from 'express'
import setupDb from './db'

const port = process.env.PORT || 3000

const app = createExpressServer({
    controllers:[]
})

setupDb()
  .then(_ => {
    app.listen(port)
    console.log(`Listening on port ${port}`)
  })
  .catch(err => console.error(err))


