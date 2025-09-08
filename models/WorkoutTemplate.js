import db from '../db.js';
import { DataTypes } from 'sequelize';

const WorkoutTemplate = db.define(
    'WorkoutTemplate', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'workout_templates',
        timestamps: false,
    } 
);

export default WorkoutTemplate;