const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskId: {
        type: String,
        unique: true
    },
    partnerId: {
        type: String,
    },
    orderId: {
        type: String,
        required: true
    },
    pickUpLong: {
        type: String,
    },
    pickUpLat: {
        type: String,
    },
    pickUpAddress: {
        type: String,
    },
    pickUpUserName: {
        type: String,
    },
    pickUpUserContact: {
        type: String,
    },
    dropLong: {
        type: String,
    },
    dropLat: {
        type: String,
    },
    dropAddress: {
        type: String,
    },
    dropUserName: {
        type: String,
    },
    dropUserContact: {
        type: String,
    },
    status: {
        type: String,
        enum: ["accepted", "way_to_pick_up", "reached_pick_up", "picked", "way_to_drop", "reached_drop", "pending", "delivered"],
        default: "pending"
    },
})

const taskModel = mongoose.model("task", taskSchema);
module.exports = taskModel;