import db from '../db.js';
import { DataTypes } from 'sequelize';

const User = db.define(
    'User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        google_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        last_sync: {
            type: DataTypes.DATE(3),
            allowNull: false,
        },
    }, {
        tableName: 'users',
        timestamps: false,
    } 
);

export default User;