import express from "express";
import cookieParser from "cookie-parser";
import db from "./db.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";
import notFound from "./middlewares/notFound.js";
import authRouter from "./routes/authRoutes.js";
import bodyMeasurementsRoutes from "./routes/bodyMeasurementsRoutes.js";
import workoutTemplatesRoutes from "./routes/workoutTemplatesRoutes.js";
import "./sync.js"; 

const PORT = process.env.PORT;

const app = express();

// json middleware
app.use(express.json());

// cookies middleware
app.use(cookieParser());

// logger middleware
app.use(logger);

// routes
app.use("/api/auth", authRouter);
app.use("/api/bodyMeasurements", bodyMeasurementsRoutes);
app.use("/api/workoutTemplates", workoutTemplatesRoutes);

// not found middleware
app.use(notFound);

// error handling middleware
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
});