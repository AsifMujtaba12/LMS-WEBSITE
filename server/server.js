import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/db.js';
import { clerkWebhooks } from './controllers/whController.js';
// import connectCloudinary from './config/cloudinary.js';


const app = express(); // intilize express app
const PORT = process.env.PORT || 3000;


// middlewares
app.use(express.json()); // register middlewares 
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data

// api endpoints


app.get('/', (req, res) => {
    res.send('Hello LMS Server is Working!');
});
app.post('/clerk', express.json(), clerkWebhooks)
//connect database
 await connectDB()
// connectCloudinary();
app.listen(PORT, (req, res)=>{
    console.log(`Server is running on port ${PORT}`);  // log the server started message  on console  when server is running  on specified port 4000.  'PORT' is environment variable set by heroku during deployment.  If not set, server will run on port 4000.  'dotenv' package is used to load environment variables from a .env file.  'cors' package is used to enable cross-origin resource sharing.  'express.json()' is used to parse incoming request bodies into JSON.  'app.get' is used to define a GET route for the homepage.  'app.listen' is used to start the server.  'console.log' is used to log the message to the console.  'express' is a popular web application framework for Node.js.  'cors' is a middleware that enables CORS.  'dotenv' is a package that loads environment variables from a

})