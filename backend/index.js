
import cookieParser from 'cookie-parser';
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './Config/db.js';
import AuthRouter from './Routes/AuthRouter.js';
import AgentRouter from './Routes/AgentRouter.js';

const app=express()
dotenv.config();

const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'https://ai-powered-docs-hub-frontend.onrender.com',
    credentials: true
}));

app.get('/',(req,res)=>{
    res.send('Welcome to the APP')
})

app.use('/api/auth', AuthRouter)
app.use('/api/agent', AgentRouter)


app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})
