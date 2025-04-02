import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userModel from './models/userModel.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
 




// app config
const app =express()
const port =process.env.PORT || 4000

// middlewares
app.use(express.json())
app.use(cors())   // acces back end form any ip
connectDB()
connectCloudinary()// mekai uda ekai ain krnna

//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)




app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>console.log('Server Started on Port :'+port))