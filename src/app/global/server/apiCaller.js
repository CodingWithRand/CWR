async function sitePostApiFetch(path, data=undefined) {
    try{
        const response = await fetch(`/global/server/api/${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: data })
        })
        if(response.status === 200){
            const responseJSON = await response.json();
            return responseJSON.data;
        }
    }catch(e){
        console.error(e);
    }
}

async function siteGetApiFetch(path) {
    try{
        const response = await fetch(`/global/server/api/${path}`)
        if(response.status === 200){
            const responseJSON = await response.json();
            return responseJSON.data;
        }
    }catch(e){
        console.error(e);
    }
}

const updateUsername = async (username, uid) => await sitePostApiFetch("firebase/auth/uu", { username: username, uid: uid });
const updateRegistryData = async (uid, regData) => await sitePostApiFetch("firebase/auth/urd", { uid: uid, regData: regData });

const getAllUsernames = async () => await siteGetApiFetch("firebase/auth/gau");
const getRegistryData = async (uid) => await sitePostApiFetch("firebase/auth/grd", { uid: uid });
const createNewCustomToken = async (uid) => await sitePostApiFetch("firebase/auth/cnct", { uid: uid });

export { updateUsername, getAllUsernames, updateRegistryData, getRegistryData, createNewCustomToken }