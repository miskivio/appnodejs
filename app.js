const express =require ('express')
const dotenv = require ('dotenv')
const connectDB = require ('./config/db.js')
const morgan = require ('morgan')
const exphbs  = require ('express-handlebars')
const router = require ('./routes/index')
const mongoose = require('mongoose')
const path  = require ('path')
const passport = require ('passport')
const session = require ('express-session')
const colors = require ('colors')
const MongoStore = require('connect-mongo')(session)

//load config env
dotenv.config({path:'./config/config.env'})

//passport config
require('./config/passport') (passport)

//connDB
connectDB()

const app = express()

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//static folder

app.use(express.static(path.join(__dirname, 'public')))
 
//Handlebars
app.engine('.hbs', exphbs({defaultLayout:'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

//session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/', router)
app.use('/auth', router) 

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on ${PORT}`.green))