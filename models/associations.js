import User from "./User.js";
import BodyMeasurement from "./BodyMeasurement.js";
import WorkoutTemplate from "./WorkoutTemplate.js";

// relations between user and his body measurements
User.hasMany(BodyMeasurement, { foreignKey: 'user_id', as: 'BodyMeasurements', onDelete: 'CASCADE'});
BodyMeasurement.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION'});

// relations between user and his workout templates
User.hasMany(WorkoutTemplate, { foreignKey: 'user_id', as: 'WorkoutTemplates', onDelete: 'CASCADE'});
WorkoutTemplate.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION'});

// relations between workout template and exercises it includes
