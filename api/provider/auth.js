const responseStatus = require("../../responseStatus");
const { auth } = require("./initialize");

const createCustomToken = async (req, res) => {
    const { uid } = req.body;
    try {
        const customToken = await auth.createCustomToken(uid)
        responseStatus.created(res, { message: "Custom token has been created!", requireJSON: true, responseJSON: { token: customToken } })
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