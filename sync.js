import db from './db.js';
import './models/User.js';
import './models/BodyMeasurement.js';
import './models/WorkoutTemplate.js';
import './models/Exercise.js';
import './models/WorkoutTemplateExercise.js';
import './models/MuscleGroup.js';
import './models/ExerciseMuscleGroup.js';
import './models/Workout.js';
import './models/WorkoutExercise.js';
import './models/Set.js';

import './models/associations.js';

try {
    await db.sync({ alter: true});
    console.log('Database tables synchronised');
}
catch (error) {
    console.error('Database tables sync failed:', error);
}