const mongoose=require('mongoose')

async function dbConnect(){
  try {
       await mongoose.connect(process.env.MONGO_URI);

       console.log("MongoDb Connected 🎉")
  } catch (error) {
      console.log("error in connecting db-->",error);
      process.exit(1)

  }
}

module.exports={dbConnect}