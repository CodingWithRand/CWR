const responseStatus = require("../../responseStatus");
const { auth } = require("./initialize");

const syncAuth = async (req, res) => {
    const { uid } = req.body;
    await auth.createCustomToken(uid)
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
    verifyToken
}