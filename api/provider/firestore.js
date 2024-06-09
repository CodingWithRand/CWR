const { filteredSend } = require("../../util");
const { firestore } = require("./initialize");
const firebaseTools = require("firebase-tools");
const providerResponse = require("./response");

const { init, def } = firestore

async function collectionDelete(path){
    return firebaseTools.firestore.delete(path, {
        project: "codingwithrand",
        recursive: true,
        force: true
    })
}

async function crud(req, res) {
    const { path, collectionName, docName, writeData, fieldKey } = req.body;
    const mode = req.params.mode
    if(mode === 'query') res.status(403);
    const reqAction = req.query;
    const realDocPath = collectionName && docName ? path + "/" + collectionName + "/" + docName : path
    const documentContent = await init.doc(realDocPath).get();
    let responseJson;
    if(documentContent.exists) switch(mode){
        case 'ref': responseJson = await providerResponse.firestore.doc(200, init.doc(realDocPath), 'Ref'); break;
        case 'get': responseJson = await providerResponse.firestore.doc(200, documentContent, 'Snap'); break;
        case 'read': responseJson = await providerResponse.firestore.doc(200, documentContent.data(), 'Data'); break;
        case 'update': 
            try{ 
                await init.doc(path).set(writeData, { merge: true });
                responseJson = { 204: "Document updated" };
            }
            catch (e) { responseJson = { 502: e.code + e.message } };
            break;
        case 'delete': 
            switch(reqAction.deleteAction){
                case 'field':
                    await init.doc(realDocPath).set({ [fieldKey]: def.FieldValue.delete() }, { merge: true });
                    break;
                case 'document':
                    if(reqAction.cleanDeletion === 'true'){
                        if(await collectionDelete(path)) responseJson = { 204: "Document has been entirely deleted" };
                        else responseJson = { 502: "Failed to entirely delete the document" };
                    }else{
                        await init.doc(realDocPath).delete();
                    }
                    break;
            }
            responseJson = { 204: "Document deleted" }; break;
        case 'create': responseJson = { 303: "Document is existed, please use 'https://cwr-api.onrender.com/post/provider/cwr/firestore/update' instead" }; break;
        default: responseJson = { 404: "Unknown mode" }; break;
    } else if(!documentContent.exists && mode === "create") {
        if(!docName || !collectionName) return responseJson = { 400: "Document name or collection name are missing" }
        try {
            await init.collection(path + "/" + collectionName).doc(docName).set(writeData || {}, { merge: true });
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

async function sqlQuery(req, res) {
    const { path } = req.body;
    const { select, where } = req.query
    let responseJSON;

    function whereQuery(query){
        if(Array.isArray(where)) where.forEach((w) => {
            const [ field, operator, value ] = w.split(",")
            return query.where(field === "id" ? def.FieldPath.documentId() : field, operator, value)
        })
        else return query.where(where.split(",")[0] === "id" ? def.FieldPath.documentId() : where.split(",")[0], where.split(",")[1], where.split(",")[2]);
    }

    function selectQuery(query){
        if(Array.isArray(select)) return query.select(...select.split(","));
        else return query.select(select);
    }

    try{
        let query = init.collection(path);
        if(select) query = selectQuery(query);
        if(where) query = whereQuery(query);
        let docDatas = {};
        (await query.get()).forEach((doc) => docDatas[doc.id] = doc.data());
        responseJSON = { 200: { docDatas: docDatas } };
    }catch(e){
        responseJSON = { 400: e.code + e.message };
    }
    filteredSend(res, responseJSON);
}

module.exports = {
    crud,
    sqlQuery
}