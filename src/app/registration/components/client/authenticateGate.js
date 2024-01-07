"use client"

import { useGlobal } from "@/glient/global"
import { Hooks } from "@/glient/util";
import { useState } from "react";
import { Components } from "@/geutral/util";

export default function AuthenticateGate({ children }){
    const { LoadingPage } = Components;
    const { login, authUser } = useGlobal();
    const [ showingComponent, setShowingComponent ] = useState(LoadingPage)
    Hooks.useDelayedEffect(() => {
        if(login === true && authUser !== null){
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