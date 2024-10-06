const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
const donorRoutes = require('./routes/donorRoutes');
// const donationRoutes = require('./routes/donationRoutes');
// const bloodStockRoutes = require('./routes/bloodStockRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
const cron = require('node-cron');
const { sendAnniversaryEmails } = require('./services/notificationService');
const errorHandler = require('./middleware/errorHandler'); // Correct import
require('dotenv').config();

const app = express();

// Security Middlewares
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter); // Apply rate limiting to all requests

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Update to your frontend's URL
  optionsSuccessStatus: 200
}));

// Body Parser Middleware
app.use(express.json()); // Using express.json() instead of body-parser

// Routes
app.use('/auth', authRoutes);
// app.use('/users', userRoutes);
// app.use('/donors', donorRoutes);
// app.use('/donations', donationRoutes);
// app.use('/blood-stock', bloodStockRoutes);
// app.use('/notifications', notificationRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Blood Bank Backend API');
});

// Error Handling Middleware (Should be after all routes)
app.use(errorHandler);

// Sync Database and Start Server
const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// Schedule Cron Job to Send Anniversary Emails Daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily anniversary email job...');
  try {
    await sendAnniversaryEmails();
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});
