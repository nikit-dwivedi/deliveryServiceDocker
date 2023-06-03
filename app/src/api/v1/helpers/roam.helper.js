const { responseFormatter } = require("../formatter/response.format")
const { post, get } = require("../services/axios.service")
const { createUser, nearByUser } = require("../services/url.service")
require('dotenv').config()

const apiKey = process.env.ROAM_API_KEY

exports.registerToRoam = async () => {
    try {
        const url = createUser()
        const mobileData = {
            "app_type": 1,
            "device_token": "token"
        }
        const headers = { "Api-key": apiKey }
        const { status, message, data } = await post(url, mobileData, headers)
        return responseFormatter(status, message, data)
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}

exports.getNearByPartner = async (long, lat) => {
    try {
        const url = nearByUser(long, lat)
        const headers = { "Api-key": apiKey }
        let { status, message, data } = await get(url, headers)
        if (status) {
            data = data.data
        }
        return responseFormatter(status, message, data)
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}

exports.creatTrip=async()=>{
    try {
        const url = nearByUser(long, lat)
        const headers = { "Api-key": apiKey }
        let { status, message, data } = await get(url, headers)
        if (status) {
            data = data.data
        }
        return responseFormatter(status, message, data)
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}