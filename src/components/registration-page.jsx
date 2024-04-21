import "../css/use/registration-page.css"
import { useEffect } from "react"
import { auth } from "../scripts/firebase";
import { useNavigate } from "react-router-dom";
import { Functions, Hooks } from "../scripts/util";
import { useGlobal } from "../scripts/global";
import { signInWithCustomToken } from "firebase/auth";
import { BgMusicController } from "./setup";
import { Components } from "../scripts/util";
import { signOut } from "@firebase/auth";

export default function RegistrationPage(){
    const navigator = useNavigate();
    const { login } = useGlobal();

    Hooks.useDelayedEffect(() => {
        if(login.isLoggedIn && auth.currentUser?.emailVerified){
            (async () => {
                const userAuthenticatedStatesResponse= await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
                });
                const userAuthenticatedStates = await userAuthenticatedStatesResponse.json();
                const thisSiteStates = userAuthenticatedStates.docData[window.location.origin];
                if(!thisSiteStates.authenticated) signOut(auth);
                else{
                    navigator("/");
                    window.location.reload();
                }
            })();
        }else{
            (async () => {
                try{
                    const usersResponse= await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: "util/availableUser", adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
                    });
                    const users = await usersResponse.json();
                    const userId = users.docData[localStorage.getItem("clientUsername")];
                    const userAuthenticatedStatesResponse= await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: `util/authenticationSessions/${userId}/Web`, adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
                    });
                    const userAuthenticatedStates = await userAuthenticatedStatesResponse.json();
                    const thisSiteState = userAuthenticatedStates.docData[window.location.origin];

                    let authenticationToken;
                    if(thisSiteState?.authenticated) authenticationToken = await Functions.createNewCustomToken(userId)

                    if(authenticationToken){
                        await signInWithCustomToken(auth, authenticationToken);
                        const registryData = await Functions.getRegistryData(userId);
                        const ip = await Functions.getClientIp();
                        await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ path: `util/authenticationSessions/${userId}/Web`, writeData: {...registryData, [window.location.origin]: { authenticated: true, at: { place: ip, time: Date() } } }, adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
                        })
                        navigator("/");
                    };
                }catch(e){
                    console.error(e)
                }
            })();
        }
    }, [login.isLoggedIn], 100);

    useEffect(() => {
        (async () => {
            await Functions.jobDelay(() => {
                try { document.querySelector('.h-reg').classList.add("animate"); }
                catch (error) { console.error(error); };
            }, 400)
            await Functions.jobDelay(() => {
                try { document.querySelector('#registration-iframe').classList.add("animate"); }
                catch (error) { console.error(error); };
            }, 1000)
        })();
    }, []);

    useEffect(() => {
        const registrationResponseMessageHandle = async (e) => {
            const responseRegistration = e.data;
            if(responseRegistration.authenticationProgressFinished){
                await Functions.jobDelay(() => {
                    try { document.querySelector('.h-reg').classList.remove("animate"); }
                    catch (error) { console.error(error); };
                }, 400)
                await Functions.jobDelay(() => {
                    try { 
                        document.querySelector('#registration-iframe').classList.remove("animate");
                    }
                    catch (error) { console.error(error); };
                }, 1000)
                document.querySelector("#animation-controller").click();
                setTimeout(() => document.querySelector("main").remove(), 2000);
                try{
                    document.getElementById("registration-iframe").contentWindow.postMessage({ action: "resetFirebaseAuth" }, "https://codingwithrand.vercel.app");
                    const usersResponse= await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: "util/availableUser", adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
                    });
                    const users = await usersResponse.json();
                    const userId = users.docData[responseRegistration.clientUsername]
                    const newToken = await Functions.createNewCustomToken(userId);
                    const registryData = await Functions.getRegistryData(userId);
                    const ip = await Functions.getClientIp();
                    await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: `util/authenticationSessions/${userId}/Web`, writeData: {...registryData, [window.location.origin]: { authenticated: true, at: { place: ip, time: Date() } } }, adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
                    })
                    await signInWithCustomToken(auth, newToken);
                    localStorage.setItem("clientUsername", auth.currentUser.displayName);
                }catch(e){
                    console.error(e);
                }
            }
        }
        window.addEventListener("message", registrationResponseMessageHandle)
        return () => window.removeEventListener("message", registrationResponseMessageHandle)
    }, [])

    return(
        <div className="page-container spaceship-cockpit-panel">
            <div className="setup">
                <BgMusicController />
            </div>
            <h1 className="h-reg responsive">Please let me know who you are</h1>
            <iframe
                id="registration-iframe"
                className="crossite-iframe"
                src="https://codingwithrand.vercel.app/registration"
            />
            <Components.HyperspaceTeleportationBackground />
        </div>
    );
};