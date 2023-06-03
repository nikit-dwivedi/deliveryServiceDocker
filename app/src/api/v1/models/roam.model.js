const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roamUserSchema = new Schema({
    partnerId: {
        type: String,
        unique: true,
        required: true
    },
    roamId: {
        type: String,
        unique: true,
        required: true
    },
    appId: {
        type: String
    },
    onDuty: {
        type: Boolean,
        default: false
    },
    zone: {
        type: String
    },
    isOccupied: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

exports.roamUserModel = mongoose.model("roamUser", roamUserSchema)