const { taskFormatter } = require("../formatter/data.format");
const { responseFormatter } = require("../formatter/response.format");
const { roamUserModel } = require("../models/roam.model");
const taskModel = require("../models/task.model");
const { post } = require("../services/axios.service");
const { addPartnerToOrder } = require("../services/url.service");

exports.createNewTask = async (taskData) => {
    try {
        const formattedData = taskFormatter(taskData);
        const taskCheck = await taskModel.findOne({ orderId: formattedData.orderId, status: "pending" })
        if (taskCheck) {
            return responseFormatter(false, "task already created")
        }
        const saveData = new taskModel(formattedData);
        await saveData.save()
        return responseFormatter(true, "task created");
    } catch (error) {
        return responseFormatter(true, error.message);
    }
}

exports.getPartnerTask = async (partnerId, status) => {
    try {
        if (status == 'all') {
            status = ["accepted", "rejected", "pending", "completed"]
        }
        const taskList = await taskModel.find({ partnerId, status }).select("-_id -__v ")
        return taskList[0] ? responseFormatter(true, "task list", taskList) : responseFormatter(false, "no task found")
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}

exports.getTaskByOrderId = async (partnerId, orderId) => {
    try {
        let status = "accepted"
        const taskList = await taskModel.findOne({ partnerId, orderId, status }).select("-_id -__v ")
        return taskList ? responseFormatter(true, "task list", taskList) : responseFormatter(false, "no task found")
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}

exports.changeTaskStatus = async (partnerId, taskId, status, token) => {
    try {
        const taskData = await taskModel.findOne({ taskId });
        if (!taskData) {
            return responseFormatter(false, "no task found")
        }
        if (taskData.partnerId != partnerId) {
            return responseFormatter(false, "Task don't belong to this user")
        }
        if (taskData.status !== "pending") {
            if (taskData.status == "accepted" && status == "completed") {
                taskData.status = status
                await taskData.save()
                return responseFormatter(true, "Task updated", status);
            }
            return responseFormatter(false, "Task status can't be changed now")
        }
        if (status == "accepted") {
            await this.addToOder(taskId, partnerId, taskData.orderId, token)
        } else {
            await roamUserModel.findOneAndUpdate({ partnerId }, { isOccupied: false })
        }
        taskData.status = status
        await taskData.save()
        return responseFormatter(true, "Task updated");
    } catch (error) {
        return responseFormatter(false, error.message);
    }
}

exports.addToOder = async (taskId, partnerId, orderId, token) => {
    try {
        const url = addPartnerToOrder();
        const bodeData = { taskId, partnerId, orderId }
        const headers = { 'Authorization': token }
        const response = await post(url, bodeData, headers)
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}