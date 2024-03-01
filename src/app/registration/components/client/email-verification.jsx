import Client from "@/glient/util";
import "./client.css"
import { useEffect, useState } from "react";
import { reload, sendEmailVerification } from "@firebase/auth";
import { auth } from "@/glient/firebase";
import { useGlobal } from "@/glient/global";
import Neutral from "@/app/global/neutral/util";

const { Dynamic } = Client.Components;
const { Image } = Dynamic;

export default function EmailVerifificationPage() {
    const [ timer, countdown ] = useState(60);
    const [ btnState, setBtnState ] = useState(true);

    const { login } = useGlobal();

    Client.Hooks.useDelayedEffect(() => {
        if(login.isLoggedIn && auth.currentUser?.emailVerified) window.location.replace("/");
    }, [login.isLoggedIn, auth.currentUser?.emailVerified], 100);

    Client.Hooks.useDelayedEffect(() => {
        const user = auth.currentUser;
        const intervalId = setInterval(() => {
            if(!user) return;
            if(user.emailVerified) window.location.replace("/")
            else reload(user).then(() => console.log('Reloaded')).catch((error) => console.error('Error while try to fetch data from database:', error));
        }, 1000);
        return () => clearInterval(intervalId);
    }, [], 1000)
    
    useEffect(() => {
        (async () => {
            await Neutral.Functions.asyncDelay(1000);
            if(timer < 1){
                setBtnState(false);
                return;
            };
            countdown((prevTime) => {return prevTime - 1});
        })();
    }, [timer])

    return(
        <div className="notf-box responsive">
            <div className="notf-title theme text-color">We have sent a verification email to you!</div>
            <Image constant dir="icon/" cls="email-icon responsive" alt="email" name="email.png"/>
            <div className="notf-msg theme text-color">Please check your inbox</div>
            <button className="notf-action" disabled={btnState} onClick={() => sendEmailVerification(auth.currentUser).then(() => {
                console.log('success again');
                setBtnState(true);
                countdown(60);
            })}>{`Click to send the verification email again in ${timer}s`}</button>
        </div>
    )
}