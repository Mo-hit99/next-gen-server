import express from "express";
import cors from 'cors'
import dotenv from "dotenv";
import helmet from "helmet";
import { db_connection } from "./DB Connection/db_connection.js";
import { Product_router } from "./routes/product_router.js";
import { User_route } from "./routes/User_routes.js";
import invoice_Router from "./routes/invoice_router.js";
import Payment_router from "./routes/payment_router.js";
import { createServer } from "http";  // Import createServer from 'http'
import { Server } from "socket.io";  // Import Server from 'socket.io'
import { CustomerCareChatBox_router } from "./routes/CustomerCare_router.js";

dotenv.config();

const port= process.env.PORT || 8080;
const app = express();
app.use(helmet());

// Create HTTP server
const httpServer = createServer(app);  // Create an HTTP server from the Express app
  
// Set up Socket.io
const io = new Server(httpServer, {
  cors: {
      origin: process.env.CLIENT_HTTP_LINK, // Adjust this as needed for your client
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
  },
});

// Middleware to make io available to routes
app.use((req, res, next) => {
req.io = io;
next();
});

const corsOptions = {
  origin: `${process.env.CLIENT_HTTP_LINK}`, // Allow this origin
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
app.use(CustomerCareChatBox_router);
app.options('*', cors(corsOptions)); 

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle incoming messages
  socket.on("sendMessage", (message) => {
      console.log("Message received:", message);
      // You can emit this message to other clients
      socket.broadcast.emit("receiveMessage", message); // Broadcast the message to all other clients
  });

  socket.on("disconnect", () => {
      console.log("User disconnected");
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log('Server running at http://localhost:' + port);
  db_connection();
});

// app.listen(port,()=>{
//   console.log(port);
//   db_connection()
// })