import express from "express";
import cors from 'cors'
import dotenv from "dotenv";
import helmet from "helmet";
import { db_connection } from "./DB Connection/db_connection.js";
import { Product_router } from "./routes/product_router.js";
import { User_route } from "./routes/User_routes.js";
import invoice_Router from "./routes/invoice_router.js";
import Payment_router from "./routes/payment_router.js";



dotenv.config();

const port= process.env.PORT || 8080;
const app = express();
app.use(helmet({
  contentSecurityPolicy: false, // Disables CSP
  hidePoweredBy: true, // Hides "X-Powered-By" header
  xssFilter: true, // Adds XSS protection
  frameguard: { action: 'deny' } // Prevents Clickjacking
}));
const corsOptions = {
  origin: 'https://next-gen-clothings.vercel.app', // Allow this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, // If you need to include credentials (cookies, authorization headers)
};
app.use(cors(corsOptions))
app.use(express.json())



app.use(Product_router)
app.use(User_route)
app.use(Payment_router)
app.use(invoice_Router)
app.options('*', cors(corsOptions)); 

app.listen(port,()=>{
  console.log(port);
  db_connection()
})