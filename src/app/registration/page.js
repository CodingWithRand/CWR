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
import { signOut, signInWithCustomToken } from "@firebase/auth";
import { auth } from "@/glient/firebase";
import { getRegistryData, getAllUsernames, updateRegistryData, createNewCustomToken } from "@/gerver/apiCaller";

export default function RegistrationPage() {
    const { AuthenticateGate } = Client.Components.Dynamic; 
    const { authUser, login } = useGlobal();
    return (
        <AuthenticateGate authenticatedAction={async () => {
            if(window !== window.parent){
                const targetWebsite = [
                    "https://cwr-education.vercel.app",
                ];
                window.addEventListener("message", async (event) => {
                    if(targetWebsite.some(url => url === event.origin) && event.data.action === "resetFirebaseAuth") indexedDB.deleteDatabase("firebaseLocalStorageDb");
                });
            }
        }} isolateAction={async () => {
            if(window !== window.parent){
                console.log(authUser.isAuthUser);
            }
            if(!authUser.isAuthUser) return;
            const userAuthenticatedStates = await getRegistryData(auth.currentUser.uid);
            const thisSiteStates = userAuthenticatedStates[window.location.origin];
            if(!thisSiteStates.authenticated) signOut(auth);
        }} unauthenticatedAction={async () => {
            const usernames = await getAllUsernames();
            const userAuthenticatedStates = await getRegistryData(usernames[localStorage.getItem("clientUsername")]);
            const thisSiteStates = userAuthenticatedStates[window.location.origin];
            if(thisSiteStates.authenticated){
                const newToken = await createNewCustomToken(usernames[localStorage.getItem("clientUsername")]);
                await signInWithCustomToken(auth, newToken);
                const ip = await Neutral.Functions.getClientIp();
                await updateRegistryData(auth.currentUser.uid, { origin: window.location.origin, authenticated: true, ip: ip, date: Date() });
            }
        }}
        >
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