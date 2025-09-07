import User from "./User.js";
import BodyMeasurement from "./BodyMeasurement.js";
import WorkoutTemplate from "./WorkoutTemplate.js";
import Exercise from "./Exercise.js";
import WorkoutTemplateExercise from "./WorkoutTemplateExercise.js";

// relations between user and his body measurements
User.hasMany(BodyMeasurement, { foreignKey: 'user_id', as: 'BodyMeasurements', onDelete: 'CASCADE'});
BodyMeasurement.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION'});

// relations between user and his workout templates
User.hasMany(WorkoutTemplate, { foreignKey: 'user_id', as: 'WorkoutTemplates', onDelete: 'CASCADE'});
WorkoutTemplate.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION'});

// relations between user and his exercises
User.hasMany(Exercise, { foreignKey: 'user_id', as: 'Exercises', onDelete: 'CASCADE'});
Exercise.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION'});

// relations between workout template and exercises it includes
Exercise.belongsToMany(WorkoutTemplate, { through: {model: WorkoutTemplateExercise, unique: false}, foreignKey: 'exercise_id', otherKey: 'workout_template_id'});
WorkoutTemplate.belongsToMany(Exercise, { through: {model: WorkoutTemplateExercise, unique: false}, foreignKey: 'workout_template_id', otherKey: 'exercise_id'});