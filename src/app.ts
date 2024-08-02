
// import 'reflect-metadata';
import express from "express";
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
require('dotenv/config');
import erorHandler from './helper/error-handler'



const api = process.env.API_URL;
const userRoute = require('./routers/user.routers');
const productRoute=require('./routers/product.router')
const categoryRoute=require('./routers/category.router');
const orderRoute=require('./routers/order.router');

//Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(erorHandler);
app.use('/public/uploads', express.static( __dirname + '/public/uploads'));


//Routes
app.use(`${api}/users`, userRoute);
app.use(`${api}/products`,productRoute);
app.use(`${api}/category`,categoryRoute);
app.use(`${api}/orders`,orderRoute);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

