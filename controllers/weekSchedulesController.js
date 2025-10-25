import db from '../db.js';
import { Op } from 'sequelize';
import WorkoutTemplate from '../models/WorkoutTemplate.js';
import {
    validateName,
    validateSelected,
    validateScheduledWorkouts,
} from '../validations/weekScheduleValidations.js';

const SCHEDULED_WORKOUTS_IN_WEEK_SCHEDULE_LIMIT = process.env.SCHEDULED_WORKOUTS_IN_WEEK_SCHEDULE_LIMIT;

export const getUserWeekSchedules = async (req, res, next) => {
    try {
        const user = req.user;

        let offset = parseInt(req.query.offset) || 0;
        let limit = parseInt(req.query.limit) || 10;

        if (offset < 0) {
            offset = 0;
        }

        if (limit < 0 || limit > 10) {
            limit = 10;
        }

        let startDate = req.startDate;
        let endDate = req.endDate;

        let weekSchedules;
        // startDate provided
        if (startDate) {
            weekSchedules = await user.getWeekSchedules({
                offset: offset, 
                limit: limit + 1,
                where: {
                    updated_at: {
                        [Op.gt]: startDate
                    },
                    updated_at: {
                        [Op.lte]: endDate
                    },
                },
            });
        }
        else {
            weekSchedules = await user.getWeekSchedules({
                offset: offset, 
                limit: limit + 1,
                where: {
                    updated_at: {
                        [Op.lte]: endDate
                    },
                },
            });
        }

        if (weekSchedules.length == 0) {
            console.log(`No week schedules found with offset: ${offset}, limit: ${limit}, startDate: ${startDate || 'from start'}, endDate: ${endDate}`);
            const err = new Error(`No week schedules found with offset: ${offset}, limit: ${limit}, startDate: ${startDate || 'from start'}, endDate: ${endDate}`);
            err.status = 404;
            return next(err);
        }

        const respObj = {
            has_more: false,
            data: []
        };

        if (weekSchedules.length > limit) {
            respObj.has_more = true;
            // pop last one that was loaded to check if there is more
            weekSchedules.pop();
        }

        for (const weekSchedule of weekSchedules) {

            if (weekSchedule.deleted_at != null) {
                respObj.data.push({
                    id: weekSchedule.id,
                    deleted: true,
                });

                continue;
            }

            const currWeekSchedule = {
                id: weekSchedule.id,
                deleted: false,
                scheduledWorkouts: []
            };

            const scheduledWorkouts = await weekSchedule.getScheduledWorkouts();
            for (const scheduledWorkout of scheduledWorkouts) {

                const currScheduledWorkout = {
                    id: scheduledWorkout.id,
                    workout_template_id: scheduledWorkout.workout_template_id,
                    day: scheduledWorkout.day,
                    time: scheduledWorkout.time,
                };

                currWeekSchedule.scheduledWorkouts.push(currScheduledWorkout);
            }

            respObj.data.push(currWeekSchedule);
        }

        return res.status(200).json(respObj);
    }   
    catch (error) {
        console.log(`Error while trying to load user week schedules: ${error}`);
        const err = new Error('Internal server error while trying to load week schedules');
        err.status = 500;
        return next(err);
    }    
};

export const addWeekSchedule = async (req, res, next) => {
    const t = await db.transaction();
    try {

        const user = req.user;
        const weekScheduleData = req.body;

        const templates = await user.getWorkoutTemplates({ where: { deleted_at: null } });
        const globalTemplates = await WorkoutTemplate.findAll({ where: { user_id: null } });
        const templatesIdsSet = new Set(templates.map((t) => t.id));

        for (const gT of globalTemplates) {
            templatesIdsSet.add(gT.id);
        }

        const weekSchedules = await user.getWeekSchedules({ where: { deleted_at: null } });
        const weekSchedulesNamesSet = new Set(weekSchedules.map((wS) => wS.name.toLowerCase()));

        const errors = [];

        validateName(weekScheduleData.name, errors, weekSchedulesNamesSet);

        validateSelected(weekScheduleData.selected, errors);

        validateScheduledWorkouts(weekScheduleData.scheduledWorkouts, errors, templatesIdsSet, SCHEDULED_WORKOUTS_IN_WEEK_SCHEDULE_LIMIT);

        if (errors.length > 0) {
            console.log('Failed to add week schedule');
            const err = new Error('Failed to add week schedule');
            err.status = 422;
            err.details = errors;
            return next(err);
        }     

        const weekSchedule = await user.createWeekSchedule({
            name: weekScheduleData.name,
        }, { transaction: t });

        const scheduledWorkouts = weekScheduleData.scheduledWorkouts;

        for (let i = 0; i < scheduledWorkouts.length; i++) {
            await weekSchedule.createScheduledWorkout({ 
                workout_template_id: scheduledWorkouts[i].templateId,
                day: scheduledWorkouts[i].day,
                time: scheduledWorkouts[i].time,
            }, { transaction: t });
        }

        if (weekScheduleData != null && weekScheduleData.selected === true) {
            await user.setCurrentWeekSchedule(weekSchedule, { transaction: t });
        }

        user.last_sync = weekSchedule.updated_at;
        await user.save({ transaction: t });

        await t.commit();
        console.log('Successfully added week schedule');
        return res.status(201).json({ id: weekSchedule.id, message: 'Successfully added week schedule', last_sync: user.last_sync });
    }
    catch (error) {
        await t.rollback();

        console.log(`Error while trying to add new week schedule: ${error}`);
        const err = new Error('Internal server error while adding week schedule');
        err.status = 500;
        return next(err);
    }    
};

export const editWeekSchedule = async (req, res, next) => {
    const t = await db.transaction();
    try {

        const weekScheduleId = req.params.id;
        const user = req.user;

        const weekSchedule = (await user.getWeekSchedules({ where: { id: weekScheduleId, deleted_at: null } }))[0];

        if (!weekSchedule) {
            console.log('Week schedule not found');
            const err = new Error('Week schedule not found');
            err.status = 404;
            return next(err);
        }

        const weekScheduleData = req.body;

        const templates = await user.getWorkoutTemplates({ where: { deleted_at: null } });
        const globalTemplates = await WorkoutTemplate.findAll({ where: { user_id: null } });
        const templatesIdsSet = new Set(templates.map((t) => t.id));

        for (const gT of globalTemplates) {
            templatesIdsSet.add(gT.id);
        }
        
        const weekSchedules = await user.getWeekSchedules({ where: { deleted_at: null, id: { [Op.not]: weekScheduleId } } });
        const weekSchedulesNamesSet = new Set(weekSchedules.map((wS) => wS.name.toLowerCase())); 

        const errors = [];

        validateName(weekScheduleData.name, errors, weekSchedulesNamesSet);

        validateSelected(weekScheduleData.selected, errors);

        validateScheduledWorkouts(weekScheduleData.scheduledWorkouts, errors, templatesIdsSet, SCHEDULED_WORKOUTS_IN_WEEK_SCHEDULE_LIMIT);

        if (errors.length > 0) {
            console.log('Failed to edit workout');
            const err = new Error('Failed to edit workout');
            err.status = 422;
            err.details = errors;
            return next(err);
        }
        
        await weekSchedule.update({
            name: weekScheduleData.name,
        }, { transaction: t });

        // clear previous scheduled workouts
        const currentScheduledWorkouts = await weekSchedule.getScheduledWorkouts();
        for (const currSW of currentScheduledWorkouts) {
            await currSW.destroy({ transaction: t });
        }

        const scheduledWorkouts = weekScheduleData.scheduledWorkouts;

        for (let i = 0; i < scheduledWorkouts.length; i++) {
            await weekSchedule.createScheduledWorkout({ 
                workout_template_id: scheduledWorkouts[i].templateId,
                day: scheduledWorkouts[i].day,
                time: scheduledWorkouts[i].time,
            }, { transaction: t });
        }

        if (weekScheduleData != null && weekScheduleData.selected === true) {
            await user.setCurrentWeekSchedule(weekSchedule, { transaction: t });
        }

        user.last_sync = weekSchedule.updated_at;
        await user.save({ transaction: t });

        await t.commit();
        console.log('Successfully changed week schedule');
        return res.status(200).json({ message: 'Successfully changed week schedule', last_sync: user.last_sync });
    }
    catch (error) {
        await t.rollback();

        console.log(`Error while trying to edit week schedule: ${error}`);
        const err = new Error('Internal server error while editing week schedule');
        err.status = 500;
        return next(err);
    }    
};

export const removeWeekSchedule = async (req, res, next) => {
    const t = await db.transaction();
    try {

        const weekScheduleId = req.params.id;
        const user = req.user;

        const weekSchedule = (await user.getWeekSchedules({ where: {id: weekScheduleId, deleted_at: null } }))[0];

        if (!weekSchedule) {
            console.log('Week schedule does not exist');
            const err = new Error('Week schedule does not exist');
            err.status = 404;
            return next(err);
        }

        await weekSchedule.update({ deleted_at: new Date() }, { transaction: t });

        if (weekSchedule.id == user.current_week_schedule_id) {
            user.current_week_schedule_id = null;
        }

        user.last_sync = weekSchedule.deleted_at;
        await user.save({ transaction: t });

        await t.commit();
        console.log('Successfully removed week schedule');
        return res.status(200).json({ message: 'Successfully removed week schedule', last_sync: user.last_sync });
    }   
    catch (error) {
        await t.rollback();

        console.log(`Error while trying to remove week schedule`);
        const err = new Error('Internal serve error while trying to remove week schedule');
        err.status = 500;
        return next(err);
    }    
};