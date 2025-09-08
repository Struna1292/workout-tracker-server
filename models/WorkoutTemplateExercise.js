import db from '../db.js';
import { DataTypes } from 'sequelize';

const WorkoutTemplateExercise = db.define(
    'WorkoutTemplateExercise', {
        workout_template_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        exercise_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        tableName: 'workout_templates_exercises',
        timestamps: false,
        // default indexes names are too long
        indexes: [
            {
                name: 'wte_template_idx',
                fields: ['workout_template_id']
            }, 
            {
                name: 'wte_exercise_idx',
                fields: ['exercise_id']
            },
            {
                name: 'wte_template_position_unique',
                unique: true,
                fields: ['workout_template_id', 'position']
            }
        ]
    } 
);

export default WorkoutTemplateExercise;