import User from './User.js';
import BodyMeasurement from './BodyMeasurement.js';
import WorkoutTemplate from './WorkoutTemplate.js';
import Exercise from './Exercise.js';
import WorkoutTemplateExercise from './WorkoutTemplateExercise.js';
import MuscleGroup from './MuscleGroup.js';
import ExerciseMuscleGroup from './ExerciseMuscleGroup.js';
import Workout from './Workout.js';
import WorkoutExercise from './WorkoutExercise.js';
import Set from './Set.js';
import ConfirmationCode from './ConfirmationCode.js';
import WeekSchedule from './WeekSchedule.js';
import ScheduledWorkout from './ScheduledWorkout.js';

// relations between user and his body measurements
User.hasMany(BodyMeasurement, { foreignKey: 'user_id', as: 'BodyMeasurements', onDelete: 'CASCADE'});
BodyMeasurement.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION'});

// relations between user and his workout templates
User.hasMany(WorkoutTemplate, { foreignKey: 'user_id', as: 'WorkoutTemplates', onDelete: 'CASCADE'});
WorkoutTemplate.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION'});

// relations between user and his exercises
User.hasMany(Exercise, { foreignKey: 'user_id', as: 'Exercises', onDelete: 'CASCADE'});
Exercise.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION'});

// relations between workout template and exercises it includes
Exercise.belongsToMany(WorkoutTemplate, { through: {model: WorkoutTemplateExercise, unique: false}, foreignKey: 'exercise_id', otherKey: 'workout_template_id'});
WorkoutTemplate.belongsToMany(Exercise, { through: {model: WorkoutTemplateExercise, unique: false}, foreignKey: 'workout_template_id', otherKey: 'exercise_id'});

// relations between exercise and muscle groups it works
Exercise.belongsToMany(MuscleGroup, { through: ExerciseMuscleGroup, foreignKey: 'exercise_id', otherKey: 'muscle_group_id'});
MuscleGroup.belongsToMany(Exercise, { through: ExerciseMuscleGroup, foreignKey: 'muscle_group_id', otherKey: 'exercise_id'});

// relations between user and his workouts
User.hasMany(Workout, { foreignKey: 'user_id', as: 'Workouts', onDelete: 'CASCADE' });
Workout.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION' });

// relations between workouts and exercises in it
Workout.belongsToMany(Exercise, { through: {model: WorkoutExercise, unique: false}, foreignKey: 'workout_id', otherKey: 'exercise_id', as: 'Exercises' });
Exercise.belongsToMany(Workout, { through: {model: WorkoutExercise, unique: false}, foreignKey: 'exercise_id', otherKey: 'workout_id', as: 'Workouts' });

// relations between workout exercise and it sets
WorkoutExercise.hasMany(Set, { foreignKey: 'workout_exercise_id', as: 'Sets', onDelete: 'CASCADE' });
Set.belongsTo(WorkoutExercise, { foreignKey: 'workout_exercise_id', as: 'Exercise', onDelete: 'NO ACTION' });

// relations between workout and template its been based on
WorkoutTemplate.hasMany(Workout, { foreignKey: 'workout_template_id', as: 'Workouts', onDelete: 'NO ACTION' });
Workout.belongsTo(WorkoutTemplate, { foreignKey: 'workout_template_id', as: 'Template', onDelete: 'NO ACTION' });

// relations between user and his confirmation codes
User.hasMany(ConfirmationCode, { foreignKey: 'user_id', as: 'Codes', onDelete: 'CASCADE' });
ConfirmationCode.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION' });

// relations between user and his week schedules
User.hasMany(WeekSchedule, { foreignKey: 'user_id', as: 'WeekSchedules', onDelete: 'CASCADE' });
WeekSchedule.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'NO ACTION' });

// relations between week schedule and scheduled workouts
WeekSchedule.hasMany(ScheduledWorkout, { foreignKey: 'week_schedule_id', as: 'ScheduledWorkouts', onDelete: 'CASCADE' });
ScheduledWorkout.belongsTo(WeekSchedule, { foreignKey: 'week_schedule_id', as: 'WeekSchedule', onDelete: 'NO ACTION' });

// relations between scheduled workout and workout template
WorkoutTemplate.hasMany(ScheduledWorkout, { foreignKey: 'workout_template_id', as: 'ScheduledWorkouts', onDelete: 'NO ACTION' });
ScheduledWorkout.belongsTo(WorkoutTemplate, { foreignKey: 'workout_template_id', as: 'WorkoutTemplate', onDelete: 'NO ACTION' });

// relation between user and his current selected week schedule
User.belongsTo(WeekSchedule, { foreignKey: 'current_week_schedule_id', as: 'CurrentWeekSchedule', onDelete: 'NO ACTION' });