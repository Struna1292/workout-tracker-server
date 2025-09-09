import db from '../db.js';
import { DataTypes } from 'sequelize';

const Set = db.define(
    'Set', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        workout_exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reps: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'sets',
        timestamps: false,
        indexes: [
            {
                name: 'set_workout_exercise_id_position_unique',
                unique: true,
                fields: ['workout_exercise_id', 'position']
            }
        ]
    } 
);

export default Set;