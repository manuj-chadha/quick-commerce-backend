require('dotenv').config()
const express=require('express')
const cookieParser = require('cookie-parser')
const {dbConnect} = require("./Utilities/db_connect")
const cors = require('cors')

// Import routes
const authRoutes = require('./Routes/auth.routes');
const productRoutes = require('./Routes/product.routes');
const cartRoutes = require('./Routes/cart.routes');
const categoryRoutes = require('./Routes/category.routes');
const paymentRoutes=require('./Routes/payment.routes');
const orderRoutes = require('./Routes/order.routes');


const app=express();
app.use('/api/payment/webhook', paymentRoutes);

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
app.use('/api/categories', categoryRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

const PORT=process.env.PORT || 8080
//listening server
app.listen(PORT,()=>{
  dbConnect();
  console.log(`Server listening at Port: ${PORT}`)
})
