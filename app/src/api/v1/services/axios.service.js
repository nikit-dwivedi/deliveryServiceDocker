const axios = require("axios").default;

async function axiosResponse(response, status) {
  if (!status) {
    return {status, message: response.message, data: response.data}
  }
  return { status, message: response.data.message, data: response.data.data };
}
module.exports = {
  post: async (endpoint, bodyData, headers) => {
    let config = {
      method: "post",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
      data: bodyData,
    };
    if (headers) {
      Object.assign(config.headers, headers)
    }
    return axios(config)
    .then(function (response) {
      return axiosResponse(response, true);
    })
    .catch(function (error) {
      return axiosResponse(error, false);
    });
  },
  get: async (endpoint, headers) => {
    let config = {
      method: "get",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (headers) {
      Object.assign(config.headers, headers)
    }
    return axios(config)
    .then(function (response) {
      return axiosResponse(response, true);
    })
    .catch(function (error) {
        return axiosResponse(error, false);
      });
  },
};
