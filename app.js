const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const connectDb = require('./src/config/config');
const roleRoutes = require('./src/routes/roleRoutes');
const userRoutes = require('./src/routes/userRoutes');
const logger = require('./src/middlewares/winstonLogger');
const authRoutes = require('./src/routes/authRoutes');
const restaurantRoutes = require('./src/routes/restaurantRoutes');
const categoryRoutes = require('./src/routes/categoryRoute');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const campusRoutes  = require('./src/routes/campusRoutes');
const cartRoutes = require('./src/routes/cartRoutes');


// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDb();

//Middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(helmet());
app.use((req,res,next) =>{
  logger.info(`${req.method} ${req.url} ${req.ip} ${req.hostname} ${new Date()} ${req.get('User-Agent')}`);
  next();
})
app.use((req, res, next) => {
  const timezone = process.env.TIMEZONE || 'UTC';
  req.timezone = timezone;
  next();
});



// Routes
app.use('/roles',roleRoutes);
app.use('/users',userRoutes);
app.use('/auth',authRoutes);
app.use('/restaurant',restaurantRoutes);
app.use('/category',categoryRoutes);
app.use('/product',productRoutes);
app.use('/order',orderRoutes);
app.use('/campus', campusRoutes);
app.use('/cart',cartRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
