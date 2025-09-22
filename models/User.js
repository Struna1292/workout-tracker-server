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
        verification_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        verification_code_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: true,            
        }
    }, {
        tableName: 'users',
        timestamps: false,
    } 
);

export default User;