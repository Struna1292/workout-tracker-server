import db from "../db.js";
import { DataTypes } from "sequelize";

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
    }, {
        tableName: 'body_measurements',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    }
);

export default BodyMeasurement;