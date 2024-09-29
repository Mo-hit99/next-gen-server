import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()


export async function db_connection(){
    try {
        await mongoose.connect(process.env.DBDATABASE_URL)
        console.log('connection complete!')
    } catch (error) {
        console.log(`connection failed :( ${error}`)
    }
}