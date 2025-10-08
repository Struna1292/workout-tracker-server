import db from '../db.js';
import { DataTypes } from 'sequelize';
import WorkoutTemplateExercise from './WorkoutTemplateExercise.js';

const WorkoutTemplate = db.define(
    'WorkoutTemplate', {
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
        user_id: {
            type: DataTypes.INTEGER,
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
        tableName: 'workout_templates',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updated_at',
    } 
);

// default addExercise functions works on findOrCreate
// instead of adding same exercise with different position 
// it will override position
WorkoutTemplate.prototype.addExercise = async function (exerciseId, position, options = {}) {
    const { transaction } = options;
    return await WorkoutTemplateExercise.create({
        workout_template_id: this.id,
        exercise_id: exerciseId,
        position: position
    }, { transaction });
}

export default WorkoutTemplate;