import db from '../db.js';
import { DataTypes } from 'sequelize';

const ConfirmationCode = db.define(
    'ConfirmationCode', {
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
        type: {
            type: DataTypes.ENUM,
            values: ['email-verification', 'email-removal', 'forgot-password', 'change-password'],
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'confirmation_codes',
        timestamps: false,
    } 
);

export default ConfirmationCode;