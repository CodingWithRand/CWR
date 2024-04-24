import Neutral from "../neutral/util";

/** 
 * Copy this code in your utilize code file. 
 * Only apply in web application
 */

/**
 * Fetch a POST allowed method API
 * @param {string} path API url to fetch
 * @param {object} data an object of data to POST that satisfies the endpoint's params
 * @param {number} retry numbers of retry with 1 second interval (default is 5)
 * @returns {object} response's data
 */
async function sitePostApiFetch(path, data, retry=5) {
    for(let i = 0; i < retry; i++){
        try{
            const response = await fetch(`/global/server/api/${path}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: data })
            })
            if(response.status === 200){
                const responseJSON = await response.json();
                return responseJSON.data;
                break;
            }
        }catch(e){
            console.error(e);
        }
        await Neutral.Functions.asyncDelay(1000);
    }
    console.error("Failed to fetch data from server");
}

/**
 * Fetch a GET allowed method API
 * @param {string} path API url to fetch
 * @param {number} retry numbers of retry with 1 second interval (default is 5)
 * @returns {object} response's data
 */
async function siteGetApiFetch(path, retry=5) {
    for(let i = 0; i < retry; i++){
        try{
            const response = await fetch(`/global/server/api/${path}`)
            if(response.status === 200){
                const responseJSON = await response.json();
                return responseJSON.data;
                break;
            }
        }catch(e){
            console.error(e);
        }
        await Neutral.Functions.asyncDelay(1000);
    }
    console.error("Failed to fetch data from server");
}

/**
 * Set a user's username as a new one in the CWR's firebase database
 * @param {string} newUsername new user's username
 * @param {string} uid user's id (constant)
 * @param {string | undefined} oldUsername old user's username to be removed, omit if opt to register new username.
 * @returns {Promise<void>}
 */
const updateUsername = async (newUsername, uid, oldUsername=undefined) => await sitePostApiFetch("firebase/auth/uu", { newUsername: newUsername, uid: uid, oldUsername: oldUsername });
/**
 * Update a user's registry data in the CWR's firebase database
 * @param {string} uid user's username to be altered (selector)
 * @param {{origin: string, authenticated: boolean, ip: string, date: string}} regData an object that includes origin, authenticated, ip, and date keys.
 * @returns {Promise<void>}
 */
const updateRegistryData = async (uid, regData) => await sitePostApiFetch("firebase/auth/urd", { uid: uid, regData: regData });

/**
 * Get all available usernames in the CWR's firebase database
 * @returns {Promise<{[username]: uid}>}
 */
const getAllUsernames = async () => await siteGetApiFetch("firebase/auth/gau");
/**
 * Get user's registry data of each applicaion that user has authenticated in the CWR's firebase database
 * @param {string} uid user's id
 * @returns {Promise<{
 *    [origin]: {authenticated: boolean, at: {place: string, time: string}}
 * }>}
 */
const getRegistryData = async (uid) => await sitePostApiFetch("firebase/auth/grd", { uid: uid });
/**
 * Generate a new custom token to authenticate.
 * @param {string} uid user's id
 * @returns {Promise<string>}
 */
const createNewCustomToken = async (uid) => await sitePostApiFetch("firebase/auth/cnct", { uid: uid });

export { updateUsername, getAllUsernames, updateRegistryData, getRegistryData, createNewCustomToken }