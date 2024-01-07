"use client"

import { Components } from "@/geutral/util"
import { auth } from "@/glient/firebase";
import "./page.css"
import { applyActionCode } from "@firebase/auth";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthenticateActionHandler() {
    const { LoadingPage } = Components

    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    const [ authicateMethodText, setAMT] = useState("")

    useEffect(() => {
        switch(mode){
            case "verifyEmail": setAMT("Verifying your email"); break;
            default: window.location.replace("/");
        }
    
        applyActionCode(auth, oobCode)
            .then(() => setAMT(() => {
                let modeSuccessText;
                switch(mode){
                    case "verifyEmail": modeSuccessText = "Successfully verify your email!"; break;
                }
                return modeSuccessText;
            }))
            .catch(() => setAMT(() => {
                let modeFailText;
                switch(mode){
                    case "verifyEmail": modeFailText = "Fail to verify your email!"; break;
                }
                return modeFailText;
            }))
    }, [])
    

    return(
        <>
            <LoadingPage />
            <div className="authentication-action">{authicateMethodText}</div>
        </>
    )
}