const { auth } = require("./initialize");

const syncAuth = async (req, res) => {
    const { uid } = req.body;
    await auth.createCustomToken(uid)
}