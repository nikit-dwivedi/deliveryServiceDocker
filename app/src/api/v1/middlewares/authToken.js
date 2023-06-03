//--------------------------------------------------modules-------------------------------------------------//
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
//--------------------------------------------------helpers-------------------------------------------------//
const { forbidden, unauthorized } = require('../helpers/response_helper');



//-------------------------------------------------privateKey----------------------------------------------//
const guestPrivateKEY = fs.readFileSync("./key/guest/guest.private.pem", "utf8");
const partnerPrivateKEY = fs.readFileSync("./key/partner/partner.private.pem", "utf8");
const userPrivateKEY = fs.readFileSync("./key/customer/user.private.pem", "utf8");
const sellerPrivateKEY = fs.readFileSync("./key/seller/seller.private.pem", "utf8");
const adminPrivateKEY = fs.readFileSync("./key/admin/root/admin.private.pem", "utf8")

//--------------------------------------------------publicKey----------------------------------------------//
const guestPublicKEY = fs.readFileSync("./key/guest/guest.public.pem", "utf8");
const partnerPublicKEY = fs.readFileSync("./key/partner/partner.public.pem", "utf8");
const sellerPublicKEY = fs.readFileSync("./key/seller/seller.public.pem", "utf8");
const userPublicKEY = fs.readFileSync("./key/customer/user.public.pem", "utf8");
const adminPublicKEY = fs.readFileSync("./key/admin/root/admin.public.pem", "utf8")

//--------------------------------------------------options-------------------------------------------------//
const signOption = { expiresIn: "30 days", algorithm: "PS256" };
const verifyOption = { expiresIn: "30 days", algorithm: ["PS256"] };

//--------------------------------------------------user-filter---------------------------------------------//

const createAuthToken = (userType, userData) => {
  switch (userType) {
    case "mrWhiteHatHacker":
      return generateAdminToken(userData)
    case "partner":
      return generatePartnerToken(userData)
    case "seller":
      return generateSellerToken(userData)
    default:
      return generateUserToken(userData)
  }
}

//--------------------------------------------------generate------------------------------------------------//
const generateUserToken = (user) => {
  const data = {
    userId: user.userId,
    customId: user.customId,
    role: 0,
  };
  return jwt.sign(data, userPrivateKEY, signOption);
};

const generateGuestToken = () => {
  const data = {
    userId: "guest",
    role: 77,
  };
  return jwt.sign(data, guestPrivateKEY, signOption);
};

const generateSellerToken = (user) => {
  const data = {
    userId: user.userId,
    customId: user.customId,
    role: 2,
    subRole: 2
  };
  return jwt.sign(data, sellerPrivateKEY, signOption);
};

const generatePartnerToken = (user) => {
  const data = {
    userId: user.userId,
    customId: user.customId,
    role: 1,
  };
  return jwt.sign(data, partnerPrivateKEY, signOption);
};

const generateAdminToken = (user) => {
  const data = {
    userId: user.userId,
    sellerId: sellerId,
    username: user.username,
    role: 777,
    subRole: 777
  };
  return jwt.sign(data, sellerPrivateKEY, signOption);
};


// ------------------------------------------------authenticate------------------------------------------------//

function authenticateGuest(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decode = parseJwt(authHeader);
      const token = authHeader.split(" ")[1];
      if (decode.role == 3) {
        jwt.verify(token, adminPublicKEY, verifyOption);
        next();
      } else if (decode.role == 2) {
        jwt.verify(token, sellerPublicKEY, verifyOption);
        next();
      } else if (decode.role == 1) {
        jwt.verify(token, partnerPublicKEY, verifyOption);
        next();
      } else if (decode.role == 0) {
        jwt.verify(token, userPublicKEY, verifyOption);
        next();
      } else {
        jwt.verify(token, guestPublicKEY, verifyOption);
        next();
      }
    } catch (error) {
      unauthorized(res, "invalid token");
    }

  } else {
    forbidden(res, "token not found");
  }
}

function authenticateUser(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decode = parseJwt(authHeader);
      const token = authHeader.split(" ")[1];
      if (decode.role == 3) {
        jwt.verify(token, adminPublicKEY, verifyOption);
        next();
      } else if (decode.role == 2) {
        jwt.verify(token, sellerPublicKEY, verifyOption);
        next();
      } else if (decode.role == 1) {
        jwt.verify(token, partnerPublicKEY, verifyOption);
        next();
      } else {
        jwt.verify(token, userPublicKEY, verifyOption);
        next();
      }
    } catch (error) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");
  }
}

function authenticatePartner(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decode = parseJwt(authHeader);
      const token = authHeader.split(" ")[1];
      if (decode.role == 3) {
        jwt.verify(token, adminPublicKEY, verifyOption);
        next();
      } else if (decode.role == 2) {
        jwt.verify(token, sellerPublicKEY, verifyOption);
        next();
      } else {
        jwt.verify(token, partnerPublicKEY, verifyOption);
        next();
      }
    } catch (error) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");
  }
}

function authenticateSeller(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decode = parseJwt(authHeader)

      const token = authHeader.split(" ")[1];
      if (decode.role == 3) {
        jwt.verify(token, adminPublicKEY, verifyOption);
        next();
      } else if (decode.role == 2) {
        jwt.verify(token, sellerPublicKEY, verifyOption);
        next();
      } else {
        jwt.verify(token, sellerPublicKEY, verifyOption);
        next();
      }
    } catch (error) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");;
  }
}

function authenticateAdmin(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, adminPublicKEY, verifyOption);
      next();
    } catch (err) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");
  }
}



function parseJwt(data) {
  try {
    let token = data.slice(7);
    const decode = Buffer.from(token.split(".")[1], "base64");
    const toString = decode.toString();
    return JSON.parse(toString);
  } catch (e) {
    return null;
  }
}

async function encryption(data) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(data, salt);
  return hash;
}

async function checkEncryption(data, encryptData) {
  const check = await bcrypt.compare(data, encryptData);
  return check;
}

module.exports = {
  generateSellerToken,
  createAuthToken,
  generatePartnerToken,
  authenticatePartner,
  generateUserToken,
  authenticateUser,
  generateGuestToken,
  authenticateGuest,
  authenticateSeller,
  authenticateAdmin,
  parseJwt,
  encryption,
  checkEncryption,
};