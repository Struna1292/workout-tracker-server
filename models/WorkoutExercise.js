import db from '../db.js';
import { DataTypes } from 'sequelize';

const WorkoutExercise = db.define(
    'WorkoutExercise', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        workout_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'workouts_exercises',
        timestamps: false,
        indexes: [
            // add index for unique position in every workout
            {
                name: 'we_workout_position_unique',
                unique: true,
                fields: ['workout_id', 'position']
            }
        ]
    } 
);

export default WorkoutExercise;