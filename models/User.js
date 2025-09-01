import db from "../db.js";
import { DataTypes } from "sequelize";

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
        }
    }, {
        tableName: 'users',
        timestamps: false,
    } 
);

export default User;