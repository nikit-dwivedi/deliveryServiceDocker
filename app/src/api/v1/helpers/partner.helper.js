const { roamUserFormatter } = require("../formatter/data.format")
const { responseFormatter } = require("../formatter/response.format")
const { roamUserModel } = require("../models/roam.model")


exports.addRoamUser = async (bodyData, roamData) => {
    try {
        const formatData = roamUserFormatter(bodyData, roamData.data);
        const saveData = new roamUserModel(formatData);
        await saveData.save();
        return responseFormatter(true, "roam user created", formatData)
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}

exports.getFreePartnerList = async () => {
    try {
        const partnerList = await roamUserModel.find({ onDuty: true, isOccupied: false })
        const roamIdList = partnerList.map(partner => {
            return partner.roamId
        })
        return responseFormatter(true, "partner list", roamIdList)
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}

exports.partnerCheck = async (nearByList) => {
    try {
        const { status, data } = await this.getFreePartnerList()
        if (!status) {
            return responseFormatter(res, "no partner nearby")
        }
        const filteredList = nearByList.filter((partner) => data.includes(partner.id))
        const formattedList = await Promise.all(filteredList.map(async (partnerDetail) => {
            const partnerData = await roamUserModel.findOne({ roamId: partnerDetail.id }).select("partnerId")
            partnerData.isOccupied = true
            await partnerData.save()
            partnerDetail.partnerId = partnerData.partnerId
            return partnerDetail
        }))
        return formattedList[0] ? responseFormatter(true, "available partner list", formattedList) : responseFormatter(false, "no partner nearby")
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}

exports.changeWorkStatus = async (partnerId) => {
    try {
        const partnerData = await roamUserModel.findOne({ partnerId })
        partnerData.onDuty = !partnerData.onDuty
        await partnerData.save()
        return responseFormatter(true, "partner status changed")
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}

exports.partnerByPartner = async (partnerId) => {
    try {
        const partnerData = await roamUserModel.findOne({ partnerId }).select("-_id -__v -isActive ")
        return partnerData ? responseFormatter(true, "partner details", partnerData) : responseFormatter(false, "partner detail not found")
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}

exports.changeOccupiedStatus = async (partnerId) => {
    try {
        await roamUserModel.findOneAndUpdate({ partnerId }, { isOccupied: false })
        return responseFormatter(true, "partner status changed")
    } catch (error) {
        return responseFormatter(false, error.message)
    }
}