const { randomBytes } = require('node:crypto');
const { encryption } = require('../middlewares/authToken');
const moment = require('moment');
require('dotenv').config()

const tookanApiKey = process.env.TOOKAN_API_KEY

module.exports = {
    authFormatter: async (data) => {
        const d = new Date
        let encryptedPassword
        const userId = randomBytes(4).toString('hex')
        const otp = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const reqId = randomBytes(4).toString('hex')
        let isPhoneOtp = true
        if (data.password) {
            encryptedPassword = await encryption(data.password)
            isPhoneOtp = false;
        }
        return {
            userId: userId,
            email: data.email,
            userType: data.userType,
            password: encryptedPassword,
            phone: data.phone,
            otp: otp,
            reqId: reqId,
            userType: data.userType,
            date: d.getDate(),
            isPhoneOtp: isPhoneOtp
        }
    },
    customerFormatter: (userId, data) => {
        const customerId = randomBytes(4).toString('hex')
        return {
            userId: userId,
            customerId: customerId,
            name: data.name,
            addressList: [{
                address: data.address,
                longitude: data.longitude,
                latitude: data.latitude,
                isDefault: true
            }]
        }
    },
    sellerFormatter: (userId, data) => {
        const sellerId = randomBytes(4).toString('hex')
        return {
            userId: userId,
            sellerId: sellerId,
            name: data.name,
            licenceNumber: data.licenceNumber,
            licenceImage: data.licenceImage,
            licenceType: data.licenceType,
            panNumber: data.panNumber,
            addharNumber: data.addharNumber,
        }
    },
    roamUserFormatter: (bodyData, roamData) => {
        const partnerId = randomBytes(4).toString('hex')
        return {
            partnerId,
            roamId: roamData.user_id,
            appId: roamData.app_id,
            zone: bodyData.zone,
        }
    },
    taskFormatter: (taskData, jobId) => {
        const { orderId, outlet, client } = taskData
        const taskId = randomBytes(4).toString('hex')
        return {
            taskId,
            partnerId: "",
            orderId: orderId,
            pickUpLong: outlet.outletLongitude,
            pickUpLat: outlet.outletLatitude,
            pickUpAddress: outlet.outletAddress,
            pickUpUserName: outlet.outletName,
            pickUpUserContact: "1234567890",
            dropLong: client.clientLongitude,
            dropLat: client.clientLatitude,
            dropAddress: client.clientAddress,
            dropUserName: client.clientName,
            dropUserContact: client.clientPhone,
        }
    },
    tookanTaskFormatter: (taskData) => {
        const { orderId, outlet, client } = taskData
        return {
            "api_key": tookanApiKey,
            "order_id": orderId,
            "auto_assignment": "1",
            "job_description": "food delivery",
            "job_pickup_phone": "1234567890",
            "job_pickup_name": outlet.outletName,
            "job_pickup_address": outlet.outletAddress,
            "job_pickup_latitude": outlet.outletLatitude,
            "job_pickup_longitude": outlet.outletLongitude,
            "job_pickup_datetime": moment().add(20, 'minutes').format('DD-MM-YYYY HH:mm'),
            "customer_username": client.clientName,
            "customer_phone": client.clientPhone,
            "customer_address": client.clientAddress,
            "latitude": client.clientLatitude,
            "longitude": client.clientLongitude,
            "job_delivery_datetime": moment().add(40, 'minutes').format('DD-MM-YYYY HH:mm'),
            "has_pickup": "1",
            "has_delivery": "1",
            "layout_type": "0",
            "tracking_link": 1,
            "timezone": "-330",
            "custom_field_template": "Template_1",
            "meta_data": [
                {
                    "label": "Price",
                    "data": "100"
                },
                {
                    "label": "Quantity",
                    "data": "100"
                }
            ],
            "pickup_meta_data": [
                {
                    "label": "Price",
                    "data": "100"
                },
                {
                    "label": "Quantity",
                    "data": "100"
                }
            ],
            "notify": 1,
            "ride_type": 0
        }
    }
}
