const { responseStatusFilter } = require("../../util");

module.exports = {
    firestore: {
        doc: async (status, doc, mode) => responseStatusFilter(status, {
            "200": () => { return { 200: { [doc + mode]: doc } } },
            "404": () => { switch(mode){
                case 'Ref': return { 404: "Document not found, please ensure the path is correct" }
                case 'Snap': return { 404: "Cannot get the document, please ensure the path is correct" }
                case 'Data': return { 404: "Cannot read the document, please ensure the path is correct" }
                case 'Update': return { 404: "Cannot update the document, please ensure the path is correct" }
                default: return { 404: "Unknown mode" }
            } },
            "*": () => { return { 400: undefined } }
        }),
    }
}