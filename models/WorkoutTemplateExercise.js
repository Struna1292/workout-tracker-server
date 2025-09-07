import db from "../db.js";
import { DataTypes } from "sequelize";

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
    } 
);

export default WorkoutTemplateExercise;