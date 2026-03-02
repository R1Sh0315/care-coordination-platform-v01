import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';
import intakeRoutes from './routes/intake.routes';
import clinicalRoutes from './routes/clinical.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting (Bonus requirement)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use('/api/', limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic Route for health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// App Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/intakes', intakeRoutes);
app.use('/api/v1/clinical', clinicalRoutes);
app.use('/api/v1', protectedRoutes);

// Error Handling Middleware (must be after routes)
app.use(errorHandler);

export default app;
