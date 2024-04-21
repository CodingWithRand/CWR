import { auth } from "@/glient/firebase"
import { useEffect, useState } from "react"
import Client from "@/glient/util";
import Neutral from "@/geutral/util";
import Loading, { useLoadingState } from "@/glient/loading";
import { useGlobal } from "@/glient/global";

const { Section } = Client.Components;

function SessionsInfo(){
    const [ sessionComponents, setSessionComponents ] = useState([]);
    const { authUser } = useGlobal();
    const setLoadingState = useLoadingState();
    Client.Hooks.useDelayedEffect(() => {
        console.log(!!authUser.isAuthUser)
        if(!authUser.isAuthUser) return
        (async () => {
            let sc = [];
            const userSessionsResponse = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
            })
            const userSessions = await userSessionsResponse.json()
            for(const [site, data] of Object.entries(userSessions.docData)){
                if(!data.authenticated) continue;
                const locationResponse = await fetch(`https://ipwho.is/${data.at.place}`);
                const location = await locationResponse.json();
                sc.push(
                    <div className="session-info" id={site.replace("https://", "").replace(".vercel.app", "")}>
                        <h3>
                            {
                                site === "https://cwr-education.vercel.app" ? "CWR Education" : 
                                site === "https://codingwithrand.vercel.app" ? "Main Website" :
                                "Unknown Site" 
                            }
                        </h3>
                        <a href={site}><b>URL: </b>{site}</a>
                        <dl>
                            <dt><i><b>Issued at:</b></i></dt>
                            <dd>{data.at.time}</dd>
                            <dt><i><b>Login location:</b></i></dt>
                            <dd>{`${location.city}, ${location.region}, ${location.country}, ${location.continent}`}</dd>
                            <dt><i><b>Internet IP:</b></i></dt>
                            <dd>{data.at.place}</dd>
                        </dl>
                        <button style={{ width: "100%", color: "dimgray" }} onClick={async () => {
                            const registryData = await Neutral.Functions.getRegistryData(auth.currentUser.uid);
                            await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, writeData: {...registryData, [site]: { authenticated: false, at: null } }, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
                            })
                            if(site === window.location.origin && window !== window.parent) window.location.replace("/registration");
                            else window.parent.postMessage({ action: "signalDeauthenticate" }, site);
                            document.getElementById(site.replace("https://", "").replace(".vercel.app", "")).remove();
                        }}><b>Logout this session</b></button>
                    </div>
                );
            }
            setSessionComponents(sc);
        })()
    }, [authUser.isAuthUser], 500)

    useEffect(() => {
        if(sessionComponents.length === 0) setLoadingState(true);
        else setLoadingState(false);
    }, [sessionComponents])
    
    return(
        <Loading cover>
            {sessionComponents}
            <button onClick={async () => {
                const userSessionsResponse = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
                })
                const userSessions = await userSessionsResponse.json()
                for(const [site, _] of Object.entries(userSessions.docData)){
                    const registryData = await Neutral.Functions.getRegistryData(auth.currentUser.uid);
                    await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, writeData: {...registryData, [site]: { authenticated: false, at: null } }, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
                    })
                    if(site === window.location.origin && window !== window.parent) window.location.replace("/registration");
                    else window.parent.postMessage({ action: "signalDeauthenticate" }, site);
                    document.getElementById("page-parent").remove()
                }
            }} style={{ fontSize: "2rem", color: "red", width: "100%" }}>Logout all sessions</button>
        </Loading>
    )
}

export default function AuthenticationManagementPanel() {
    return (
        <Section themed style="pallete" title="Authentication Management Panel" description="You can manage your account's login session here, you can log out any sessions you want.">
            <b>Current Sessions</b>
            <SessionsInfo />
        </Section>
    )
}