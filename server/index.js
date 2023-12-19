import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import aitoutes from './routes/monsterai.routes.js'

dotenv.config()
const app = express();

app.use(cors());

app.use(express.json({limit:"50mb"}))
app.use('/ai/api',aitoutes);

app.get('/',(req,res)=>{
    res.status(200).json({message:"Hello From Ai"})
})


app.listen(8080,()=>console.log('Server started on port 8080'))