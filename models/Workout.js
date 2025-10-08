import db from '../db.js';
import { DataTypes } from 'sequelize';
import WorkoutExercise from './WorkoutExercise.js';

const Workout = db.define(
    'Workout', {
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
        workout_template_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        duration: {
            type:DataTypes.INTEGER,
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
        tableName: 'workouts',
        timestamps: true,
        createdAt: false,
        updatedAt: 'updated_at',
    } 
);

// default addExercise functions works on findOrCreate
// instead of adding same exercise with different position 
// it will override position
Workout.prototype.addExercise = async function (exerciseId, position, sets, options = {}) {
    const { transaction } = options;

    const workoutExercise = await WorkoutExercise.create({
        workout_id: this.id,
        exercise_id: exerciseId,
        position: position,
    }, { transaction });

    if (sets) {
        for (let i = 0; i < sets.length; i++) {
            await workoutExercise.createSet({
                reps: sets[i].reps,
                weight: sets[i].weight,
                position: i,
            }, { transaction });
        }
    }

    return workoutExercise;
};

export default Workout;