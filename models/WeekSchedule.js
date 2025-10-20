import db from '../db.js';
import { DataTypes } from 'sequelize';

const WeekSchedule = db.define(
    'WeekSchedule', {
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        selected: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE(3),
            allowNull: false,
        },
        deleted_at: {
            type: DataTypes.DATE(3),
            allowNull: true,
        },
    }, {
        tableName: 'week_schedules',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updated_at',
    } 
);

export default WeekSchedule;