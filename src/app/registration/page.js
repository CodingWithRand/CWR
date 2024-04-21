"use client"

import "./page.css"
import SignIn from "./components/client/signin";
import SignUp from "./components/client/signup";
import SwitchPageBtn from "./components/client/switchpagebtn";
import Client from "@/glient/util";
import Script from "next/script";
import Loading from "@/glient/loading";
import Neutral from "@/geutral/util";
import { useGlobal } from "@/glient/global";
import { signOut } from "firebase/auth";
import { auth } from "../global/client/firebase";

export default function RegistrationPage() {
    const { AuthenticateGate } = Client.Components; 
    const { authUser } = useGlobal();
    return (
        <AuthenticateGate authenticatedAction={async () => {
            if(window !== window.parent){
                const targetWebsite = [
                    "https://cwr-education.vercel.app",
                ];
                window.addEventListener("message", (event) => {
                    if(targetWebsite.some(url => url === event.origin) && event.data.action === "resetFirebaseAuth") indexedDB.deleteDatabase("firebaseLocalStorageDb");
                });
                await Neutral.Functions.asyncDelay(500);
                targetWebsite.forEach((url) => window.parent.postMessage({ authenticationProgressFinished: true, clientUsername: authUser.isAuthUser.displayName , origin: window.location.origin }, url));
            }
        }} isolateAction={async () => {
            const userAuthenticatedStatesResponse= await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
            });
            const userAuthenticatedStates = await userAuthenticatedStatesResponse.json();
            const thisSiteStates = userAuthenticatedStates.docData[window.location.origin];
            if(!thisSiteStates.authenticated) signOut(auth);
        }}>
            <Loading cover>
                <main>
                    <Script src="/vanilla-js/frontend/registration.js"/>
                    <div className="bg-wrapper">
                        <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="minimal-bg">
                            <polygon points="0,0 0,100
                            100,100 0,0" fill="black" style={{ opacity: 0 }} />
                        </svg>
                        <div className="init-dot">
                            <div className="trail"></div>
                        </div>
                        <svg width="100px" height="100px" viewBox="0 0 100 100" className="dice-logo">
                            <rect width="100" height="100" x="0" rx="25" fill="lightgray" />
                            <circle cx="30" cy="70" r="10" fill="black" />
                            <circle cx="70" cy="30" r="10" fill="black" />
                        </svg>
                    </div>
                    <div className="login-pallete" style={{ transform: "translateY(-20%)", opacity: 0 }}>
                        <div className="reg-wrapper" focusing="login">
                            <div id="login" className="reg-box">
                                <SignIn />
                            </div>
                            <div id="signup" className="reg-box">
                                <SignUp />
                            </div>
                        </div>
                        <SwitchPageBtn/>
                    </div>
                </main>
            </Loading>
        </AuthenticateGate>
    )
};