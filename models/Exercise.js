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
            allowNull: false,
            defaultValue: '',
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: 'exercises',
        timestamps: false,
    } 
);

export default Exercise;