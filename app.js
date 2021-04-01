import express from 'express'
import  dotenv from 'dotenv'
import connectDB from './config/db.js'
import morgan from 'morgan'

import colors from 'colors'

//load config 

dotenv.config({path:'./config/config.env'})

connectDB()

const app = express()

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on ${PORT}`.green))