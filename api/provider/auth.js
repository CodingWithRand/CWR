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

const setCustomUserClaims = async (req, res) => {
    const { uid, claims, securityStage } = req.body;
    try {
        switch(securityStage){
            case "none":
                await auth.setCustomUserClaims(uid, claims);
                responseStatus.noContent(res, "User's claims has been set!");
            default:
                responseStatus.notFound(res, "Invalid security stage!");
        }
    } catch (e) {
        responseStatus.badRequest(res, e.message)
    }
}

module.exports = {
    createCustomToken,
    verifyToken,
    setCustomUserClaims
}