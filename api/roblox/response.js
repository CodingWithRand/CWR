delete require.cache[require.resolve("../../util")];
const { responseStatusFilter } = require("../../util");

module.exports =  {
    exist: async (status, data, additionCondition=false) => responseStatusFilter(status, {
        "200": () => {
            if(additionCondition) return { 404: "user not found" };
            return { 200: 
                { 
                    status: "exist",
                    userId: data.id,
                    username: data.name,
                    displayName: data.displayName,
                    isBanned: data.isBanned
                } 
            };
        },
        "404": () => { return { 404: "user not found" } },
        "*": () => { return { 400: undefined } }
    }),
    
    info: async(statuses, data) => responseStatusFilter(statuses, {
        "200": () => {
            let dataToSend = data;
            dataToSend.generalData.isPremium = data.isPremium;
            switch(data.presenceState.userPresenceType){
                case 0:
                    dataToSend = {...data, presenceState: { ...data.presenceState, currentPresenceState: "Currently Offline" }};
                    break;
                case 1:
                    dataToSend = {...data, presenceState: { ...data.presenceState, currentPresenceState: "Currently Online" }};
                    break;
                case 2:
                    dataToSend = {...data, presenceState: { ...data.presenceState, currentPresenceState: "In Game" }};
                    break;
                case 3:
                    dataToSend = {...data, presenceState: { ...data.presenceState, currentPresenceState: "In Studio" }};
                    break;
                case 4:
                    dataToSend = {...data, presenceState: { ...data.presenceState, currentPresenceState: "Invisible" }};
                    break;
            }
            delete dataToSend.isPremium;
            delete dataToSend.presenceState.lastLocation;
            delete dataToSend.presenceState.placeId;
            delete dataToSend.presenceState.rootPlaceId;
            delete dataToSend.presenceState.gameId;
            delete dataToSend.presenceState.universeId;
            delete dataToSend.presenceState.userId;
            return { 200: { data: dataToSend } };
        },
        "*": () => { return { 400: undefined } }
    }),
}