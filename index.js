const express = require("express"); 
require("dotenv").config()
const app = express();  
app.use(express.json());
const cors = require('cors'); 
const authorization = require('./router/user/Auth')
const productRouter = require('./router/product/product')
const imagesRouter = require('./router/Images/images')
const settingsRouter = require('./router/Setting/setting')
const blogRouter = require('./router/Blogs/Blog')


app.use(cors());
//connect to database
const mongoose = require("mongoose");
 
const connectDB = async () =>{
    try {
        mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.g7cyd.mongodb.net/Authorization?retryWrites=true&w=majority`,
        {
            useCreateIndex:true,
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify: false
        },
        console.log("Conncet database success!!!") 
        )

    } catch (error) {
        console.log("Connect db fail" + error   )
        process.exit(1)
    }
}
connectDB(); 
 
app.post('/',(req,res)=> res.send("Hello word !!!"));
app.use('/uploads', express.static('uploads'))

//router 
app.use('/api',authorization)
app.use('/api',productRouter)
app.use('/api',imagesRouter)
app.use('/api',settingsRouter)
app.use('/api',blogRouter) 

const port = process.env.PORT || 4000
app.listen(port, ()=> console.log("Server start thành công !!! Port " + port))