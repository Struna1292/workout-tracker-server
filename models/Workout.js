import db from '../db.js';
import { DataTypes } from 'sequelize';

const Workout = db.define(
    'Workout', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        duration: {
            type:DataTypes.INTEGER,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'workouts',
        timestamps: false,
    } 
);

export default Workout;