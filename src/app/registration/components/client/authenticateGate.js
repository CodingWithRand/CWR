"use client"

import { useGlobal } from "@/glient/global"
import Client from "@/glient/util";
import { useState } from "react";
import Neutral from "@/geutral/util";

export default function AuthenticateGate({ children }){
    const { LoadingPage } = Neutral.Components;
    const { login, authUser } = useGlobal();
    const [ showingComponent, setShowingComponent ] = useState(LoadingPage)
    Client.Hooks.useDelayedEffect(() => {
        if(login.isLoggedIn === true && authUser.isAuthUser !== null){
            const UserAuthState = {
                login: login,
                authUser: authUser
            }
            const targetWebsite = [
                "https://cwr-education.web.app/"
            ]
            targetWebsite.forEach((url) => window.parent.postMessage({ type: "UserAuthState", result: JSON.stringify(UserAuthState), url }))
            window.location.replace("/")
        }
        setShowingComponent(children);
    }, [], 500)
    return showingComponent
}