import db from '../db.js';
import { DataTypes } from 'sequelize';

const Exercise = db.define(
    'Exercise', {
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
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        tableName: 'exercises',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updated_at',
    } 
);

export default Exercise;