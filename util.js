const response = require("./responseStatus")

async function middlewareFunction(callback){
    try{return await callback()}
    catch(err){console.error(err); return}
};

function responseStatusFilter(status, configs){
    let responseStatus = status || 200
    if(Array.isArray(status)) for(const s of status) if(s !== 200){responseStatus = s; break;};
    for(const [statusCode, callback] of Object.entries(configs)){
        if(statusCode !== "*" && isNaN(Number(statusCode))) throw new Error("Invalid error code!");
        if(responseStatus === Number(statusCode)){ return callback();}
    }
    return configs["*"]();
}

function filteredSend(res, processedData){
    const respondingStatus = Object.keys(processedData)[0];
    const respondingBody = Object.values(processedData)[0];
    switch(respondingStatus){
        case "200": response.ok(res, respondingBody); break;
        case "204": response.noContent(res, respondingBody); break;
        case "400": response.badRequest(res, respondingBody); break;
        case "404": response.notFound(res, respondingBody); break;
    }
}

function query(res, resData, reqQuery){
    if(Object.keys(resData)[0] === "200"){
        const retrieveProcessedDataItem = (infoItem) => { 
            let filteredData = {};
            for(const pdk of Object.keys(resData["200"].data)) if(infoItem.includes(pdk)) filteredData[pdk] = resData["200"].data[pdk];
            return filteredData; 
        }
        let output = { data: {} };
        output.data = retrieveProcessedDataItem(reqQuery.split(","));

        if(Object.keys(output.data).length === 0) filteredSend(res, {404: "item not found"})
        else filteredSend(res, {200: output})
    }
}

module.exports = {
    middlewareFunction,
    responseStatusFilter,
    filteredSend,
    query
}