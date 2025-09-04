import express from "express";
import cookieParser from "cookie-parser";
import db from "./db.js";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";
import notFound from "./middleware/notFound.js";
import authRouter from "./routes/authRoutes.js";

const PORT = process.env.PORT;

const app = express();

// json middleware
app.use(express.json());

// cookies middleware
app.use(cookieParser());

// logger middleware
app.use(logger);

app.use("/api/auth", authRouter);

// not found middleware
app.use(notFound);

// error handling middleware
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);
});