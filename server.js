require('dotenv').config()
const express=require('express')
const cookieParser = require('cookie-parser')
const {dbConnect} = require("./Utilities/db_connect")
const cors = require('cors')

// Import routes
const authRoutes = require('./Routes/auth.routes');
const productRoutes = require('./Routes/product.routes');
const cartRoutes = require('./Routes/cart.routes');


const app=express()

const corsConfiguration={
  origin: ["http://localhost:5173", "https://quickkart-project.vercel.app"],
   credentials: true,
}


//Important Middlewares
app.use(cors(corsConfiguration)) //cors middleware
app.use(express.json()) //for parsing  json body to js object

app.use(express.urlencoded({extended:true})) //for hhandling form data

app.use(cookieParser()) //for cookies

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);


const PORT=process.env.PORT || 8080
//listening server
app.listen(PORT,()=>{
  dbConnect();
  console.log(`Server listening at Port: ${PORT}`)
})
