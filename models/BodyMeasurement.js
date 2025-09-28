import db from '../db.js';
import { DataTypes } from 'sequelize';

const BodyMeasurement = db.define(
    'BodyMeasurement', {
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
        weight: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        arm: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        forearm: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,            
        },
        chest: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,            
        },
        waist: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,            
        },
        hips: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,            
        },
        thigh: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,            
        },
        calf: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,            
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        tableName: 'body_measurements',
        timestamps: false,
    }
);

export default BodyMeasurement;