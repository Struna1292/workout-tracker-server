import express from 'express';
import cookieParser from 'cookie-parser';
import './db.js';
import './config.js';
import errorHandler from './middlewares/errorHandler.js';
import logger from './middlewares/logger.js';
import notFound from './middlewares/notFound.js';
import authRouter from './routes/authRoutes.js';
import usersRouter from './routes/usersRoutes.js';
import bodyMeasurementsRouter from './routes/bodyMeasurementsRoutes.js';
import workoutTemplatesRouter from './routes/workoutTemplatesRoutes.js';
import exercisesRouter from './routes/exercisesRoutes.js';
import muscleGroupsRouter from './routes/muscleGroupsRoutes.js';
import workoutsRouter from './routes/workoutsRoutes.js';
import './sync.js'; 
import cors from 'cors';

const PORT = process.env.PORT;

const app = express();

// cors middleware
app.use(cors());

// json middleware
app.use(express.json());

// cookies middleware
app.use(cookieParser());

// logger middleware
app.use(logger);

// routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/bodyMeasurements', bodyMeasurementsRouter);
app.use('/api/workoutTemplates', workoutTemplatesRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/muscleGroups', muscleGroupsRouter);
app.use('/api/workouts', workoutsRouter);

// not found middleware
app.use(notFound);

// error handling middleware
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
});