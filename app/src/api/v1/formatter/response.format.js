exports.responseFormatter = (status, message, data = {}) => {
    return { status, message, data }
}