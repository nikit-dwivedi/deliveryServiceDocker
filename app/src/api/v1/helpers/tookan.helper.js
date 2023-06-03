const { tookanTaskFormatter, taskFormatter } = require("../formatter/data.format")
const { responseFormatter } = require("../formatter/response.format")
const { roamUserModel } = require("../models/roam.model")
const taskModel = require("../models/task.model")
const { post } = require("../services/axios.service")
const { createTookanTask } = require("../services/tookan.service")
const { addPartnerToOrder, changeOrderStatusUrl } = require("../services/url.service")

exports.createNewTask = async (taskData) => {
    try {
        const formattedTookanData = tookanTaskFormatter(taskData)
        const { status, message, data } = await createTookanTask(formattedTookanData)
        console.log({ status, message, data });
        if (!status) {
            return responseFormatter(false, message);
        }
        const formattedTask = taskFormatter(taskData, data.job_id)
        const saveData = new taskModel(formattedTask)
        await saveData.save()
        return responseFormatter(true, "task created", data);
    } catch (error) {
        return responseFormatter(false, error.message);
    }
}

exports.handelEvent = async (event) => {
    try {
        const { job_state, task_status, order_id } = event
        switch (job_state) {
            case "Accepted":
                console.log("delivery Partner has accepted the order");
                const taskData = await this.changeTaskStatus(order_id, "accepted", event.fleet_id)
                await this.addToOder(taskData.data.taskId, event, taskData.data.orderId)
                break;
            case "Started":
                if (task_status === 4) {
                    const taskData = await this.changeTaskStatus(order_id, "way_to_pick_up")
                    console.log("delivery Partner on it's way to restaurant");
                    break;
                } else {
                    const taskData = await this.changeTaskStatus(order_id, "way_to_drop")
                    console.log("delivery Partner on it's way to customer");
                    break;
                }
            case "InProgress":
                if (task_status === 4) {
                    const taskData = await this.changeTaskStatus(order_id, "reached_pick_up")
                    console.log("delivery Partner reached restaurant");
                    break;
                } else {
                    const taskData = await this.changeTaskStatus(order_id, "reached_drop")
                    console.log("delivery Partner reached customer");
                    break;
                }
            case "Successful":
                if (task_status === 4) {
                    const taskData = await this.changeTaskStatus(order_id, "picked")
                    await this.changeOrderStatus(order_id, "dispatched")
                    console.log("delivery Partner successfully picked the order");
                    break;
                } else {
                    console.log(order_id);
                    const taskData = await this.changeTaskStatus(order_id, "delivered")
                    await this.changeOrderStatus(order_id, "delivered")
                    console.log("delivery Partner successfully delivered the order");
                    break;
                }
        }
        return event ? responseFormatter(true, "partner details", event) : responseFormatter(false, "partner detail not found")
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}

exports.getTaskDetailsByJobId = async (jobId) => {
    try {
        const taskData = await taskModel.findOne({ jobId })
        return taskData ? responseFormatter(true, "task data", taskData) : responseFormatter(false, "task not found")
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}


exports.changeTaskStatus = async (orderId, status, partnerId) => {
    try {
        const query = { status }
        if (partnerId) {
            query.partnerId = partnerId
        }
        const taskData = await taskModel.findOneAndUpdate({ orderId }, query, { new: true })
        return responseFormatter(true, "task updated", taskData)
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}


exports.addToOder = async (taskId, partnerData, orderId) => {
    try {
        const url = addPartnerToOrder();
        const bodyData = { taskId, partnerData, orderId }
        const response = await post(url, bodyData)
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

exports.changeOrderStatus = async (orderId, orderStatus) => {
    try {
        const url = changeOrderStatusUrl();
        const bodyData = { orderId, orderStatus }
        const response = await post(url, bodyData)
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
