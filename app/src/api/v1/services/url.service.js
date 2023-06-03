const roamBase = 'https://api.roam.ai/v1'
const orderBaseStage = 'http://139.59.60.119:4007'
const orderBaseProd = 'https://order.fablocdn.com'
const tookanBase = 'https://api.tookanapp.com'


//----------------------------------------- roam URLs -----------------------------------------

exports.createUser = () => {
    return `${roamBase}/api/user/`
}

exports.nearByUser = (long, lat) => {
    return `${roamBase}/api/search/users/?location=${[lat, long]}&radius=10000`
    // return `${roamBase}/api/search/users/?location=${lat},${long}}`
}

exports.createTripUrl = () => {
    return `${roamBase}/api/search/users/?location=${[lat, long]}&radius=10000`
}


//----------------------------------------- order URLs -----------------------------------------

exports.createTookanTaskUrl = () => {
    return `${tookanBase}/v2/create_task`
}


//----------------------------------------- order URLs -----------------------------------------

exports.addPartnerToOrder = () => {
    return `${orderBaseProd}/v1/order/partner`
}

exports.changeOrderStatusUrl = () => {
    return `${orderBaseProd}/v1/order/partner/status`
}