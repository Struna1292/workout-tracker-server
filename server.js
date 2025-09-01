import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import logger from "./middleware/logger.js";
import notFound from "./middleware/notFound.js";

const PORT = process.env.PORT;

const app = express();

// json middleware
app.use(express.json());

// logger middleware
app.use(logger);

// not found middleware
app.use(notFound);

// error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});