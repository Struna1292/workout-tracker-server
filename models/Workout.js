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
    }, {
        tableName: 'workouts',
        timestamps: false,
    } 
);

// default addExercise functions works on findOrCreate
// instead of adding same exercise with different position 
// it will override position
Workout.prototype.addExercise = async function (exerciseId, position, sets) {

    const workoutExercise = await WorkoutExercise.create({
        workout_id: this.id,
        exercise_id: exerciseId,
        position: position,
    });

    if (sets) {
        for (let i = 0; i < sets.length; i++) {
            await workoutExercise.createSet({
                reps: sets[i].reps,
                weight: sets[i].weight,
                position: i,
            });
        }
    }

    return workoutExercise;
};

export default Workout;