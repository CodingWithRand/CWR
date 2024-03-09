const { filteredSend } = require("../../util");
const { firestore } = require("./initialize");
const providerResponse = require("./response");

async function crud(req, res) {
    const { path, collectionName, docName, writeData } = req.body;
    const mode = req.params.mode
    const documentContent = await firestore.doc(path + "/" + collectionName + "/" + docName).get();
    let responseJson;
    if(!docName || !collectionName) return responseJson = { 400: "Document name or collection name are missing" }
    if(documentContent.exists) switch(mode){
        case 'ref': responseJson = await providerResponse.firestore.doc(200, firestore.doc(path), 'Ref'); break;
        case 'get': responseJson = await providerResponse.firestore.doc(200, documentContent, 'Snap'); break;
        case 'read': responseJson = await providerResponse.firestore.doc(200, documentContent.data(), 'Data'); break;
        case 'update': 
            try{ 
                await firestore.doc(path).set(writeData, { merge: true });
                responseJson = { 204: "Document updated" };
            }
            catch (e) { responseJson = { 400: e.code + e.message } };
            break;
        case 'create': responseJson = { 303: "Document is existed, please use 'https://cwr-api.onrender.com/post/provider/cwr/firestore/update' instead" }; break;
        default: responseJson = { 404: "Unknown mode" }; break;
    } else if(!documentContent.exists && mode === "create") {
        try {
            await firestore.collection(path + collectionName).doc(docName).set(writeData || {}, { merge: true });
            responseJson = { 201: `New document has been created in the collection "${collectionName}" of '${path}'` };
        } catch (e) { 
            responseJson = { 400: e.code + e.message };
        }
    } else responseJson = await providerResponse.firestore.doc(404, documentContent, (
        mode === 'ref' ? 'Ref' : 
        mode === 'get' ? 'Snap' : 
        mode === 'read' ? 'Data' : 
        mode === 'update' ? 'Update' : 
        ''
    ));
    filteredSend(res, responseJson);
}

module.exports = {
    crud
}