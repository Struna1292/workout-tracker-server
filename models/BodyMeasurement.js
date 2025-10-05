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
            allowNull: true,
        },
        arm: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        forearm: {
            type: DataTypes.FLOAT,
            allowNull: true,         
        },
        chest: {
            type: DataTypes.FLOAT,
            allowNull: true,            
        },
        waist: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        hips: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        thigh: {
            type: DataTypes.FLOAT,
            allowNull: true,        
        },
        calf: {
            type: DataTypes.FLOAT,
            allowNull: true,         
        },
        date: {
            type: DataTypes.DATE,
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
        tableName: 'body_measurements',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updated_at',
    }
);

export default BodyMeasurement;