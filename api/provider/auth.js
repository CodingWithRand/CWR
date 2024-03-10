const responseStatus = require("../../responseStatus");
const { auth } = require("./initialize");

const createCustomToken = async (req, res) => {
    const { uid } = req.body;
    try {
        await auth.createCustomToken(uid)
        responseStatus.noContent(res, "Token created!")
    } catch (e) {
        responseStatus.notFound(res, "Invalid uid!")
    }
}

const verifyToken = async (req, res) => {
    const { token } = req.body;
    try {
        await auth.verifyIdToken(token)
        responseStatus.noContent(res, "Token is valid!")
    } catch (e) {
        responseStatus.notFound(res, "Invalid token!")
    }
}

module.exports = {
    createCustomToken,
    verifyToken
}