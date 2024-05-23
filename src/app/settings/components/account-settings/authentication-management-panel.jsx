import { auth } from "@/glient/firebase"
import { useEffect, useState } from "react"
import Client from "@/glient/util";
import Loading, { useLoadingState } from "@/glient/loading";
import { useGlobal } from "@/glient/global";
import { getRegistryData, updateRegistryData } from "@/gerver/apiCaller";
import { signOut } from "firebase/auth";

const { Section } = Client.Components.Dynamic;

function SessionsInfo(){
    const [ sessionComponents, setSessionComponents ] = useState([]);
    const { authUser } = useGlobal();
    const setLoadingState = useLoadingState();
    Client.Hooks.useDelayedEffect(() => {
        console.log(!!authUser.isAuthUser)
        if(!authUser.isAuthUser) return
        (async () => {
            let sc = [];
            const userSessions = await getRegistryData(auth.currentUser.uid)
            for(const [site, data] of Object.entries(userSessions)){
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
                            await updateRegistryData(auth.currentUser.uid, { origin: site, authenticated: false, ip: null, date: null });
                            if(site === window.location.origin && window === window.parent){
                                window.location.replace("/registration");
                                signOut(auth)
                            }
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
                const userSessions = await getRegistryData(auth.currentUser.uid)
                for(const [site, _] of Object.entries(userSessions)){
                    await updateRegistryData(auth.currentUser.uid, { origin: site, authenticated: false, ip: null, date: null });
                    if(site === window.location.origin && window === window.parent){
                        window.location.replace("/registration");
                        signOut(auth)
                    }
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