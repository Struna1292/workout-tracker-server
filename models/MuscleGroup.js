import db from '../db.js';
import { DataTypes } from 'sequelize';

const MuscleGroup = db.define(
    'MuscleGroup', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'muscle_groups',
        timestamps: false,
    } 
);

export default MuscleGroup;