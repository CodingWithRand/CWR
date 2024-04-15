import "../css/use/registration-page.css"
import { useEffect, useState } from "react"
import { auth } from "../scripts/firebase";
import { useNavigate } from "react-router-dom";
import { Functions, Hooks } from "../scripts/util";
import { useGlobal } from "../scripts/global";
import { signInWithCustomToken } from "firebase/auth";
import { BgMusicController } from "./setup";
import { Components } from "../scripts/util";

export default function RegistrationPage(){
    const navigator = useNavigate();
    const { login } = useGlobal();
    const [ registrationIframe, setRegistrationIframe ] = useState();

    Hooks.useDelayedEffect(() => {
        if(login.isLoggedIn && auth.currentUser?.emailVerified){ 
            (async () => {
                await Functions.jobDelay(() => {
                    try { document.querySelector('.h-reg').classList.remove("animate"); }
                    catch (error) { console.error(error); };
                }, 400)
                await Functions.jobDelay(() => {
                    try { 
                        document.querySelector('#registration-iframe').classList.remove("animate");
                        document.querySelector("#animation-controller").click(); 
                    }
                    catch (error) { console.error(error); };
                }, 1000)
            })().then(() => navigator("/"));
        }
        else setRegistrationIframe(
            <iframe
                id="registration-iframe"
                src="https://codingwithrand.vercel.app/registration"
            />
        )
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
                setRegistrationIframe(null);
                try{
                    document.getElementById("registration-iframe").contentWindow.postMessage({}, "https://codingwithrand.vercel.app");
                    const usersResponse= await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: "util/availableUser", adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
                    });
                    const users = await usersResponse.json();
                    const userId = users.docData[responseRegistration.clientUsername]
                    const thisSiteTokenResponse = await fetch("https://cwr-api.onrender.com/post/provider/cwr/auth/createCustomToken", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ uid: users.docData[responseRegistration.clientUsername], adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
                    })
                    const thisSiteToken = await thisSiteTokenResponse.json();
                    const registryDataResponse = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: `util/authenticationSessions/${userId}/Web`, adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
                    });
                    const registryData = await registryDataResponse.json();
                    await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ path: `util/authenticationSessions/${userId}/Web`, writeData: {...registryData.docData, [window.location.origin]: { authenticated: true, token: thisSiteToken.data.token, at: Date() } }, adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
                    })
                    await signInWithCustomToken(auth, thisSiteToken.data.token);
                }catch(e){
                    console.error(e);
                    //window.location.reload();
                }
            }
        }
        window.addEventListener("message", registrationResponseMessageHandle)
        return () => window.removeEventListener("message", registrationResponseMessageHandle)
    }, [])

    return(
        <div className="page-container" style={{ justifyContent: "center", overflow: "hidden", backgroundImage: 'url("/imgs/backend-images/spaceship-cockpit.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPositionX: 'center' }}>
            <div className="setup">
                <BgMusicController />
            </div>
            <h1 className="h-reg responsive">Please let me know who you are</h1>
            {registrationIframe}
            <Components.HyperspaceTeleportationBackground />
        </div>
    );
};