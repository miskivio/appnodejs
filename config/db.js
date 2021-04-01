import mongoose from 'mongoose'
import colors from 'colors'

const connectDB = async() =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrLParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log(`Mongo DB connected! ${conn.connection.host}`.yellow)
    } catch (err) {
        process.exit(1)
    }
}


export default connectDB