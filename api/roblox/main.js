const { middlewareFunction, filteredSend, query } = require("../../util");
const axios = require("axios");
const robloxResponse = require("./response");
const response = require("../../responseStatus")

module.exports = {
    userExist: async (req, res) => {
        const reqKey = req.params.userKey;
    
        if(!isNaN(Number(reqKey))){
            await middlewareFunction(async () => {
                const apiResponse = await axios.get(`https://users.roblox.com/v1/users/${reqKey}`);
                const processedData = await robloxResponse.exist(apiResponse, apiResponse.data, undefined);
                filteredSend(res, processedData);
            });
        }else{
            await middlewareFunction(async () => {
                const apiResponse = await axios.post(`https://users.roblox.com/v1/usernames/users`, {
                    "usernames": [reqKey],
                    "excludeBannedUsers": false
                });
                if(apiResponse.data.data.length !== 0){
                    const anotherApiResponse = await middlewareFunction(async () => await axios.get(`https://users.roblox.com/v1/users/${apiResponse.data.data[0].id}`));
                    if(anotherApiResponse.status < 400) apiResponse.data.data[0].isBanned = anotherApiResponse.data.isBanned;
                };
                const processedData = await robloxResponse.exist(apiResponse.status, apiResponse.data.data[0], apiResponse.data.data.length === 0)
                filteredSend(res, processedData);
            })
        }
    },
    getUserInfo: async (req, res) => {
        const { userId, category } = req.params;
        const infoItems = req.query.items;
    
        if(!isNaN(Number(userId))){
            const apiResponses = {
                users: await axios.get(`https://users.roblox.com/v1/users/${userId}`),
                premium: await axios.get(`https://premiumfeatures.roblox.com/v1/users/${userId}/validate-membership`, { headers: { "Cookie": process.env.COOKIES_LOGGER } }),
                presence: await axios.post(`https://presence.roblox.com/v1/presence/users`, { "userIds": [userId] }, { headers: { "Cookie": process.env.COOKIES_LOGGER } }),
                acquaintancesCount: {
                    friends: await axios.get(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
                    followers: await axios.get(`https://friends.roblox.com/v1/users/${userId}/followers/count`),
                    followings: await axios.get(`https://friends.roblox.com/v1/users/${userId}/followings/count`)
                },
                avatar: {
                    fullBody: await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=352x352&format=Png&isCircular=false`),
                    headShot: await axios.get(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=150x150&format=Png&isCircular=true`)
                }
            }
    
            switch(category){
                case "about":
                    const { users, presence, premium, acquaintancesCount, avatar } = apiResponses
                    const { friends, followers, followings } = acquaintancesCount
                    const { fullBody, headShot } = avatar
                    await middlewareFunction(async () => {
                        const processedData = await robloxResponse.info(
                            [
                                users.status, 
                                presence.status, 
                                premium.status, 
                                acquaintancesCount.friends.status,
                                acquaintancesCount.followers.status,
                                acquaintancesCount.followings.status,
                                avatar.fullBody.status,
                                avatar.fullBody.headShot
                            ], 
                            { 
                                generalData: users.data,
                                isPremium: premium.data,
                                presenceState: presence.data.userPresences[0],
                                acquaintancesCount: {
                                    friends: friends.data.count,
                                    followers: followers.data.count,
                                    followings: followings.data.count
                                },
                                avatar: {
                                    fullBody: fullBody.data.data[0].imageUrl,
                                    headShot: headShot.data.data[0].imageUrl
                                }
                            }
                        );
                        if(infoItems !== undefined) query(res, processedData, infoItems);
                        else filteredSend(res, processedData);
                    })
                    break;
                default:
                    response.notFound(res);
                    break;
            } 
        }
    }
} 