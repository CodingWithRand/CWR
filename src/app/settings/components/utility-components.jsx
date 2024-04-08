import { signOut } from "firebase/auth";
import { auth } from "@/glient/firebase";
import { useState, useEffect } from "react";
import { useGlobal } from "@/glient/global";
import { useLoadingState } from "@/glient/loading";
import Client from "@/glient/util";
import Neutral from "@/geutral/util";

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
    return (
        <button onClick={async () => {
            setLoadingState(true);
            try {
                const req = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, writeData: { authenticated: false, token: null }, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
                });
                const res = await req.json();
                console.log(res);
                await Neutral.Functions.asyncDelay(5000);
            } catch (e) { console.error(e) }
            await signOut(auth);
            setLoadingState(false);
            window.location.replace("/registration");
        }}><Image name="exit.png" dir="icon/" width={35} height={35} /></button>
    )
}