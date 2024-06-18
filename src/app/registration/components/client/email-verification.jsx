import Client from "@/glient/util";
import "./client.css"
import { useEffect, useState } from "react";
import { reload, sendEmailVerification } from "@firebase/auth";
import { auth } from "@/glient/firebase";
import { useGlobal } from "@/glient/global";
import Neutral from "@/app/global/neutral/util";
import Cookies from "universal-cookie";

const { Dynamic } = Client.Components;
const { Image } = Dynamic;

export default function EmailVerifificationPage() {
    const cookies = new Cookies();
    const [ timer, countdown ] = useState(60);
    const [ btnState, setBtnState ] = useState(true);

    const { login } = useGlobal();

    Client.Hooks.useDelayedEffect(() => {
        if(login.isLoggedIn && auth.currentUser?.emailVerified) if(window === window.parent) window.location.replace("/");
    }, [login.isLoggedIn, auth.currentUser?.emailVerified], 1000);

    Client.Hooks.useDelayedEffect(() => {
        const intervalId = setInterval(() => {
            const user = auth.currentUser;
            if(!user) return;
            if(user.emailVerified){
                console.log('verified');
                cookies.set("emailVerified", true, { path: "/" });
                if(window === window.parent) window.location.replace("/")
            }
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