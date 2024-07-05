const { responseManager } = require('../services');
const { taskManager } = require('../services');

const create = async (request, response) => {
    try {
        const result = await taskManager.create(request.body,request.user);
        return responseManager.sendSuccessResponse(response, result, 'Task created successfully.');
    } catch (err) {
        return responseManager.sendErrorResponse(response, err);
    }
};

const update = async (request, response) => {
    try {
        const result = await taskManager.update(request.body, request.params , request.user);
        return responseManager.sendSuccessResponse(response, result, 'Task updated successfully.');
    } catch (err) {
        return responseManager.sendErrorResponse(response, err);
    }
};

const deleteTask = async (request, response) => {
    try {
        const result = await taskManager.deleteTask(request.params,request.user);
        return responseManager.sendSuccessResponse(response, result, 'Task deleted successfully.');
    } catch (err) {
        return responseManager.sendErrorResponse(response, err);
    }
};

const search = async(request, response) => {
    try{
        const result = await taskManager.search(request.query,request.user)
        return responseManager.sendSuccessResponse(response, result, 'Task Searched Successfully')
    }catch (err) {
        return responseManager.sendErrorResponse(response, err);
    }
}

const prioritized = async (request, response) => {
    try {
        const result = await taskManager.prioritized(request.body, request.user);
        return responseManager.sendSuccessResponse(response, result, 'Prioritized status updated successfully.');
    } catch (err) {
        return responseManager.sendErrorResponse(response, err);
    }
};


const sort = async (request, response) => {
    try {
        const result = await taskManager.sort(request.query, request.user);
        return responseManager.sendSuccessResponse(response, result, 'Prioritized status updated successfully.');
    } catch (err) {
        return responseManager.sendErrorResponse(response, err);
    }
};

const updateStatus = async (request, response) => {
    try {
        const result = await taskManager.updateStatus(request.body, request.user);
        return responseManager.sendSuccessResponse(response, result, 'Prioritized status updated successfully.');
    } catch (err) {
        return responseManager.sendErrorResponse(response, err);
    }
}


const get = async (request, response) => {
    try {
        const result = await taskManager.get(request.params,request.user);
        return responseManager.sendSuccessResponse(response, result, 'Task retrieved successfully.');
    } catch (err) {
        return responseManager.sendErrorResponse(response, err);
    }
};

const getAll = async (request, response) => {
    try {
        const result = await taskManager.getAll(request.user);
        return responseManager.sendSuccessResponse(response, result, 'Tasks retrieved successfully.');
    } catch (err) {
        return responseManager.sendErrorResponse(response, err);
    }
};

module.exports = { create, update, deleteTask, get, getAll, search, prioritized, updateStatus, sort };
