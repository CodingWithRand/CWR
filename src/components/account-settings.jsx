import { useEffect } from "react"
import { useGlobal } from "../scripts/global"
import { Components, Functions } from "../scripts/util";

export default function AccountSettings() {
    const { theme } = useGlobal();
    useEffect(() => {
        (async () => {
            await Functions.jobDelay(() => {
                try { document.querySelector('#account-settings-iframe').classList.add("animate"); }
                catch (error) { console.error(error); };
            }, 1000)
        })();
    }, []);

    useEffect(() => {
        const handleChildIFrameMessages = (event) => {
            if(event.origin === "https://codingwithrand.vercel.app"){
                if(event.data.status === "ready"){
                    document.getElementById("account-settings-iframe").contentWindow.postMessage({ action: "resetFirebaseAuth" }, "https://codingwithrand.vercel.app");
                    document.getElementById("account-settings-iframe").contentWindow.postMessage({ 
                        action: "signalAuthenticate", 
                        username: localStorage.getItem("clientUsername"),
                        parentWindowTheme: theme.theme
                    }, "https://codingwithrand.vercel.app")
                }
                else if(event.data.action === "signalDeauthenticate") window.location.replace("/registration");
                else if(event.data.action === "signalUpdateClientUsername") localStorage.setItem("clientUsername", event.data.newUsername);
            }
        }

        window.addEventListener("message", handleChildIFrameMessages);
        return () => window.removeEventListener("message", handleChildIFrameMessages)
    }, [])
    return(
        <div className="page-container spaceship-cockpit-panel">
            <iframe id="account-settings-iframe" className="crossite-iframe" src="https://codingwithrand.vercel.app/settings" />
            <Components.HyperspaceTeleportationBackground />
        </div>
    )
}