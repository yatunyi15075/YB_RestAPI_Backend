import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sequelize from './config/db.js';
import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import otpRoutes from './routes/otpRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Routes
app.use('/api/user', userRoute); // User registration
app.use('/api/login', authRoute); // Authentication route
app.use('/api/otp', otpRoutes);

// Database Connection
sequelize.sync({ alter: true })
    .then(() => console.log('Database synchronized'))
    .catch((err) => console.log('Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
