import User from "./User.js";
import BodyMeasurement from "./BodyMeasurement.js";

User.hasMany(BodyMeasurement, { foreignKey: 'user_id', as: 'BodyMeasurements', onDelete: 'CASCADE'});
BodyMeasurement.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION'});