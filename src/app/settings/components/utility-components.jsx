import { signOut } from "firebase/auth";
import { auth } from "@/glient/firebase";
import { useState, useEffect } from "react";
import { useGlobal } from "@/glient/global";
import { useLoadingState } from "@/glient/loading";
import Client from "@/glient/util";
import { updateRegistryData } from "@/gerver/apiCaller";
import Cookies from "universal-cookie";

const { Dynamic } = Client.Components;
const { Image } = Dynamic;

export function Username(){
    const { authUser } = useGlobal();
    const [ showingUsername, setShowingUsername ] = useState();

    useEffect(() => {
    if(authUser.isAuthUser) {
        setShowingUsername(authUser.isAuthUser.displayName)
    }
    }, [authUser.isAuthUser])

    return <li className="text-sm sm:text-base">{showingUsername}</li>
}

export function SignOutBTN() {
    const setLoadingState = useLoadingState();
    const cookies = new Cookies();

    return <button onClick={async () => {
        setLoadingState(true);
        try {
            await updateRegistryData(auth.currentUser.uid, { origin: window.location.origin, authenticated: false, ip: null, date: null });
            await signOut(auth);
            cookies.set("emailVerified", false, { path: "/" });
            cookies.set("username", undefined, { path: "/" });
        } catch (e) { console.error(e); }
        setLoadingState(false);
        window.location.replace("/registration");
    }}><Image name="exit.png" dir="icon/" width={35} height={35} /></button>
}