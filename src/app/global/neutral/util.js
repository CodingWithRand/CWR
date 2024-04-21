import "@/gss/util.css";
import "@/gss/theme.css";
import "@/gss/responsive.css";

async function asyncDelay(ms) { return new Promise((resolve) => setTimeout(() => resolve(), ms)); };
async function jobDelay(callback, ms){
    let timeoutId;
    await new Promise((resolve) => {
        timeoutId = setTimeout(() => {
            callback();
            resolve();
        }, ms);
    });
    clearTimeout(timeoutId);
};

function syncDelay(ms) {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
        now = Date.now();
    };
};

async function getRegistryData(userId){
    const registryDataResponse = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: `util/authenticationSessions/${userId}/Web`, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
    });
    const registryData = await registryDataResponse.json();
    return registryData.docData;
}

async function createNewCustomToken(userId){
    const newTokenResponse = await fetch("https://cwr-api.onrender.com/post/provider/cwr/auth/createCustomToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userId, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
      })
      const newToken = await newTokenResponse.json();
      return newToken.data.token;
}

async function getClientIp(){
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipResponse.json();
    return ipData.ip
}

function LoadingPage(props) {
    return(
        <div className={`loading-bar ${props?.transparentBg ? "bg-[#f0f0f080]" : "bg-[#f0f0f0]"}`}>
            <div className="loading-dot" id="d1"></div>
            <div className="loading-dot" id="d2"></div>
            <div className="loading-dot" id="d3"></div>
        </div>
    )
}

const Components = {
    LoadingPage
}

const Functions = {
    asyncDelay,
    jobDelay,
    syncDelay,
    getRegistryData,
    createNewCustomToken,
    getClientIp
};

const Neutral = {
    Components, Functions
}

export default Neutral