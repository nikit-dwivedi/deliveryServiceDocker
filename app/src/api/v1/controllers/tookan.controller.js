const { unknownError, success, badRequest } = require("../helpers/response_helper")
const { createNewTask, handelEvent } = require("../helpers/tookan.helper")

exports.createTask = async (req, res) => {
    try {
        let taskData = req.body
        const { status, message } = await createNewTask(taskData)
        return status ? success(res, message) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.getEvents = async (req, res) => {
    try {
        const { status, message, data } = await handelEvent(req.body)
        return status ? success(res, message, data) : badRequest(res, message)
    } catch (error) {
        console.log(error);
        return unknownError(res, error.message)
    }
}