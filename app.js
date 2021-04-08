const express =require ('express')
const dotenv = require ('dotenv')
const connectDB = require ('./config/db.js')
const morgan = require ('morgan')
const exphbs  = require ('express-handlebars')
const router = require ('./routes/index')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
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

//Body parser
app.use(express.urlencoded())

app.use(express.json())

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


//handlebar halpers
const {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
} = require('./helpers/hbs')

//method override
app.use(methodOverride(function(req, res){
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//static folder
app.use(express.static(path.join(__dirname, 'public')))
 
//Handlebars
app.engine('.hbs', exphbs({helpers: {
    formatDate, 
    stripTags,
    truncate,
    editIcon, 
    select
}, defaultLayout:'main', extname: '.hbs'}))
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

//set global var
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})

//Routes
app.use('/', router)
app.use('/auth', router) 
app.use('/stories', require('./routes/stories')) 

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on ${PORT}`.green))