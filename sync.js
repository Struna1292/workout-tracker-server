import db from "./db.js";
import "./models/User.js";
import "./models/BodyMeasurement.js";
import "./models/associations.js";
import "./models/WorkoutTemplate.js";
import "./models/Exercise.js";

try {
    await db.sync({ alter: true});
    console.log('Database tables synchronised');
}
catch (error) {
    console.error('Database tables sync failed:', error);
}