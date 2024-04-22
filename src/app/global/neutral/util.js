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
    getClientIp
};

const Neutral = {
    Components, Functions
}

export default Neutral