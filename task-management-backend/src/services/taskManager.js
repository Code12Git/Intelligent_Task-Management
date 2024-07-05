const _ = require('lodash');
const { taskModel } = require('../models');
const { BAD_REQUEST, NOT_FOUND } = require('../utils/errors');
const { AppError } = require('../utils');
const { io } = require('../utils')

// Create Task

const create = async (body, user) => {
    const { title, description } = body;
    const { _id: userId } = user;
    try {
        if (_.isEmpty(title) || _.isEmpty(description)) {
            const error = { ...BAD_REQUEST, message: "All fields are required" };
            throw new AppError(error.code, error.message, error.statusCode);
        }

        const task = await taskModel.create({
            title,
            description,
            userId
        });

        io.emit('taskCreated', {
            userId: user._id,
            task
        });

        return task;
    } catch (err) {
        throw err;
    }
};


// Update Task

const update = async (body, params, user) => {
    const { title, description } = body;

    const { id } = params;

    const { _id: userId } = user;

    try {
        if (_.isEmpty(title) || _.isEmpty(description)) {
            const error = { ...BAD_REQUEST, message: "All fields are required" };
            throw new AppError(error.code, error.message, error.statusCode);
        }

        const task = await taskModel.findOneAndUpdate(
            { _id: id, userId },
            { title, description },
            { new: true }
        );

        if (!task) {
            const error = { ...NOT_FOUND, message: "Task not found" };
            throw new AppError(error.code, error.message, error.statusCode);
        }

         io.emit('taskUpdated', {
            userId: user._id,
            task
        });

        
        return task;
    } catch (err) {
        throw err;
    }
};

// Delete a task
const deleteTask = async (params, user) => {
    const { id } = params;
    const { _id: userId } = user;

    try {
        const task = await taskModel.findByIdAndDelete({ _id: id, userId });
        if (!task) {
            const error = { ...NOT_FOUND, message: "Task not found" };
            throw new AppError(error.code, error.message, error.statusCode);
        }


        io.emit('taskDeleted', {
            userId: user._id,
            taskId: task._id
        });

        return task;
    } catch (err) {
        throw err;
    }
};


// Search a task

const search = async(query, user) => {
    const { _id: userId } = user;

    try{
        const tasks = await taskModel.find({ ...query, userId })

         if (!tasks) {
            const error = { ...NOT_FOUND, message: "Task not found" };
            throw new AppError(error.code, error.message, error.statusCode);
        }

        return tasks;
    } catch (err){
        throw err;
    }  
}


// Prioritized tasks

const prioritized = async(body, params, user) => {

    const { prioritized } = body;
    const { id } = params;
    const { _id: userId } = user;

    try {
        if (_.isUndefined(prioritized)) {
            const error = { ...BAD_REQUEST, message: "Prioritized field must be provided" };
            throw new AppError(error.code, error.message, error.statusCode);
        }

       const task = await taskModel.findOneAndUpdate(
            { _id: id, userId },
            { $set:{ prioritized } },
            { new: true }
        );

        if (!task) {
            const error = { ...NOT_FOUND, message: "Task not found" };
            throw new AppError(error.code, error.message, error.statusCode);
        }

        return task;
    } catch (err) {
        throw err;
    }
}

// Update Status

const updateStatus = async (body, params, user) => {

    const { status } = body;
    const { id } = params;
    const { _id: userId } = user;

    try {
        if (!['active', 'pending', 'completed'].includes(status)) {
            const error = { ...BAD_REQUEST, message: "Invalid status provided" };
            throw new AppError(error.code, error.message, error.statusCode);
        }

        const task = await taskModel.findOneAndUpdate(
            { _id: id, userId },
            { status },
            { new: true }
        );

        if (!task) {
            const error = { ...NOT_FOUND, message: "Task not found" };
            throw new AppError(error.code, error.message, error.statusCode);
        }

        return task;
    } catch (err) {
        throw err;
    }
};

// Get a task by ID
const get = async (params,user) => {
    const { id } = params;
    const { _id: userId } = user;

    try {
        const tasks = await taskModel.findById({ _id: id, userId });
        if (!tasks) {
            const error = { ...NOT_FOUND, message: "Task not found" };
            throw new AppError(error.code, error.message, error.statusCode);
        }
        return tasks;
    } catch (err) {
        throw err;
    }
};

// Get all tasks
const getAll = async () => {
    const { _id: userId } = user;
    try {
        const tasks = await taskModel.find({ userId });
        if (_.isEmpty(tasks)) {
            const error = { ...NOT_FOUND, message: "No tasks found" };
            throw new AppError(error.code, error.message, error.statusCode);
        }
        return tasks;
    } catch (err) {
        throw err;
    }
};

// Sort

const sort = async (query, user) => {
    const { sortOrder } = query;
    const { _id: userId } = user;

    try {
        const sortOptions = ['asc', 'desc'];
        if (!sortOptions.includes(sortOrder)) {
            const error = { ...BAD_REQUEST, message: "Invalid sort order provided" };
            throw new AppError(error.code, error.message, error.statusCode);
        }

        const sortOrderOption = sortOrder === 'desc' ? -1 : 1;
        const tasks = await taskModel.find({ userId }).sort({ dueDate: sortOrderOption });

        if (_.isEmpty(tasks)) {
            const error = { ...NOT_FOUND, message: "No tasks found" };
            throw new AppError(error.code, error.message, error.statusCode);
        }

        return tasks;
    } catch (err) {
        throw err;
    }
};

module.exports = { create, update, deleteTask, get, getAll, search, prioritized, updateStatus, sort };
