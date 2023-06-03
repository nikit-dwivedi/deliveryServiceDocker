const { addRoamUser, partnerCheck, changeWorkStatus, partnerByPartner, changeOccupiedStatus } = require("../helpers/partner.helper");
const { success, badRequest, unknownError } = require("../helpers/response_helper");
const { registerToRoam, getNearByPartner } = require("../helpers/roam.helper");
const { createNewTask, ChangeTaskStatus, getPartnerTask, changeTaskStatus, getTaskByOrderId } = require("../helpers/task.helper");
const { parseJwt } = require("../middlewares/authToken");

exports.changeStatus = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization);
        let { taskId, orderId, status: taskStatus } = req.body
        if (!taskId && !orderId) {
            return badRequest(res, "taskId or orderId is required")
        }
        if (orderId) {
            let taskData = await getTaskByOrderId(token.customId, orderId)
            taskId = taskData.data.taskId
        }
        const { status, message, data } = await changeTaskStatus(token.customId, taskId, taskStatus, req.headers.authorization)
        if (data == "completed") {
            await changeOccupiedStatus(token.customId)
        }
        return status ? success(res, message) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message);
    }
}

exports.addToRoam = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        const { status: roamStatus, message: roamMessage, data: roamData } = await registerToRoam();
        if (!roamStatus) {
            return badRequest(res, roamMessage)
        }
        const partnerData = req.body
        const { status, message, data } = await addRoamUser(partnerData, roamData);
        return status ? success(res, message, data) : badRequest(res, message)
    } catch (error) {
        console.log(error);
        return unknownError(res, error.message)
    }
}

exports.createTask = async (req, res) => {
    try {
        let orderData = req.body
        let long = orderData.outlet.outletLongitude
        let lat = orderData.outlet.outletLatitude
        const nearByPartnerData = await getNearByPartner(long, lat)
        if (!nearByPartnerData.status) {
            return badRequest(res, nearByPartnerData.message, nearByPartnerData.data)
        }
        const checkPartner = await partnerCheck(nearByPartnerData.data.users)
        if (!checkPartner.status) {
            return badRequest(res, checkPartner.message)
        }
        const taskData = { orderData, partnerId: checkPartner.data[0].partnerId, roamId: checkPartner.data[0].id }
        const { status, message } = await createNewTask(taskData)
        return status ? success(res, message) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.partnerTask = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        const { status: taskStatus } = req.query
        const { status, message, data } = await getPartnerTask(token.customId, taskStatus)
        return status ? success(res, message, data) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.changeDutyStatus = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        const { status, message, data } = await changeWorkStatus(token.customId)
        return status ? success(res, message) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}

exports.getPartnerDetails = async (req, res) => {
    try {
        const token = parseJwt(req.headers.authorization)
        const { status, message, data } = await partnerByPartner(token.customId)
        return status ? success(res, message, data) : badRequest(res, message)
    } catch (error) {
        return unknownError(res, error.message)
    }
}