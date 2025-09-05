import express from "express";
import authToken from "../middlewares/authToken.js";
import { addMeasure } from "../controllers/bodyMeasurementsController.js";

const router = express.Router();

// add new measure for logged in user
router.post("", authToken, addMeasure);

export default router;