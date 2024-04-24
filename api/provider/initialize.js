const admin = require("firebase-admin");

const serviceAccount = require("./codingwithrand-firebase-adminsdk-g2ghs-e88a2d7f24.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {
  firestore: {
    init: admin.firestore(),
    def: admin.firestore
  },
  auth: admin.auth()
}