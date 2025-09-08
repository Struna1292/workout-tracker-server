import db from '../db.js';
import { DataTypes } from 'sequelize';

const ExerciseMuscleGroup = db.define(
    'ExerciseMuscleGroup', {
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        muscle_group_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'exercises_muscle_groups',
        timestamps: false,
    } 
);

export default ExerciseMuscleGroup;