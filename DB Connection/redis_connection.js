import redis from 'redis'
import dotenv from 'dotenv'
dotenv.config();

const redisClient = redis.createClient({
    username:'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
})

redisClient.on('error',(error)=>{
    console.error('redis connection error',error)
})


const redisDatabaseConnection = async ()=>{
    try {
        await redisClient.connect();
        const pong= await redisClient.ping()
        console.log('redis database connection completed!',pong)
    } catch (error) {
        console.log('-----> error occurred <-----' , error)
    }
}


export {redisClient , redisDatabaseConnection};