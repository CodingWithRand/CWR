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
        const handleSettingRegistry = (event) => {
            if(event.origin === "https://codingwithrand.vercel.app" && event.data.status === "ready"){
                document.getElementById("account-settings-iframe").contentWindow.postMessage({ action: "resetFirebaseAuth" }, "https://codingwithrand.vercel.app");
                document.getElementById("account-settings-iframe").contentWindow.postMessage({ 
                    action: "signalAuthenticate", 
                    username: localStorage.getItem("clientUsername"),
                    parentWindowTheme: theme.theme
                }, "https://codingwithrand.vercel.app")
            }
        }
        window.addEventListener("message", handleSettingRegistry)
        return () => window.removeEventListener("message", handleSettingRegistry)
    }, [])
    return(
        <div className="page-container spaceship-cockpit-panel">
            <iframe id="account-settings-iframe" className="crossite-iframe" src="https://codingwithrand.vercel.app/settings" />
            <Components.HyperspaceTeleportationBackground />
        </div>
    )
}