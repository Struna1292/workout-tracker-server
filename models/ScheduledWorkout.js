import db from '../db.js';
import { DataTypes } from 'sequelize';

const ScheduledWorkout = db.define(
    'ScheduledWorkout', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        week_schedule_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        workout_template_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        day: {
            type: DataTypes.ENUM,
            values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'scheduled_workouts',
        timestamps: false,
    } 
);

export default ScheduledWorkout;