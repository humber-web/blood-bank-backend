// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); 
const donorRoutes = require('./routes/donorRoutes');
const bloodInventoryRoutes = require('./routes/bloodInventoryRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes'); 
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();

// Security Middlewares
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000', // Update to your frontend's URL
  optionsSuccessStatus: 200
}));

// Body Parser Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes); 
app.use('/donors', donorRoutes); 
app.use('/blood-inventory', bloodInventoryRoutes);
app.use('/appointments', appointmentRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

// Sync Database and Start Server
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Optional: Notification Scheduler
// require('./notificationScheduler');
