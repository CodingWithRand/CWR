import { signOut } from "firebase/auth";
import { auth } from "@/glient/firebase";
import { useState, useEffect } from "react";
import { useGlobal } from "@/glient/global";
import Client from "@/glient/util";
import { getDownloadURL, ref } from "@firebase/storage";
import { storage } from "@/glient/firebase";

export function Username(){
    const { authUser } = useGlobal();
    const [ showingUsername, setShowingUsername ] = useState("erwe");

    useEffect(() => {
    if(authUser.isAuthUser) {
        setShowingUsername(authUser.isAuthUser.displayName)
    }
    }, [authUser.isAuthUser])

    return <li>{showingUsername}</li>
}

export function SignOutBTN() {
    return (
        <button onClick={async () => {
            try {
                const req = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, writeData: { authenticated: false, token: null }, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
                });
                const res = await req.json();
                console.log(res);
            } catch (e) { console.error(e) }
            signOut(auth);
            window.location.replace("/registration");
        }}>Sign Out</button>
    )
}