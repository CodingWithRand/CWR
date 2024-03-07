const { filteredSend } = require("../../util");
const { firestore } = require("./initialize");
const providerResponse = require("./response");

async function doc(req, res) {
    const { path, updateData } = req.body;
    const mode = req.params.mode
    const documentContent = await firestore.doc(path).get();
    let responseDoc;
    if(documentContent.exists) switch(mode){
        case 'ref': responseDoc = await providerResponse.firestore.doc(200, firestore.doc(path), 'Ref'); break;
        case 'get': responseDoc = await providerResponse.firestore.doc(200, documentContent, 'Snap'); break;
        case 'read': responseDoc = await providerResponse.firestore.doc(200, documentContent.data(), 'Data'); break;
        case 'update': 
            try{ 
                await documentContent.ref.update(updateData);
                responseDoc = { 204: "Document updated" };
            }
            catch (e) { responseDoc = { 400: e.code + e.message } }
        default: responseDoc = { 404: "Unknown mode" };
    }else responseDoc = await providerResponse.firestore.doc(404, documentContent, (
        mode === 'ref' ? 'Ref' : 
        mode === 'get' ? 'Snap' : 
        mode === 'read' ? 'Data' : 
        mode === 'update' ? 'Update' : 
        ''
    ));
    filteredSend(res, responseDoc)
}

module.exports = {
    doc,
}