const { responseFormatter } = require("../formatter/response.format");
const { post } = require("./axios.service");
const { createTookanTaskUrl } = require("./url.service")

exports.createTookanTask = async(taskData)=>{
    try {
        const url = createTookanTaskUrl();
        const {status,message,data} = await post(url,taskData);
        return responseFormatter(status,message,data)
    } catch (error) {
        return responseFormatter(false,error.message)
    }
}