import { Components } from "../../scripts/util";
import "../../css/use/registration-page/email-verification.css"
import { useEffect, useState } from "react";
import { onAuthStateChanged, reload, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../../scripts/firebase";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../../scripts/global";

export default function EmailVerifificationPage() {
    const navigator = useNavigate();
    const [ timer, countdown ] = useState(60);
    const [ btnState, setBtnState ] = useState(true);

    const [{}, {isLoggedIn}] = useGlobal();

    useEffect(() => {
        if(isLoggedIn) navigator("/");
    }, [isLoggedIn]);

    onAuthStateChanged(auth, (user) => {
        if(!user) return;
        if(user.emailVerified){
            signOut(auth).then(() => console.log("Successfully signed out")).catch((error) => console.error('Error to sign out user:', error));
            window.location.reload();
            navigator('/registration');
        }
        else reload(user).then(() => console.log('Reloaded')).catch((error) => console.error('Error while try to fetch data from database:', error));
    })

    useEffect(() => {
        (async () => {
            await new Promise((resolve) => setTimeout(() => {
                if(timer < 1){
                    setBtnState(false);
                    return;
                };
                countdown((prevTime) => {return prevTime - 1});
                resolve();
            }, 1000))
        })();
    }, [timer])

    return(
        <div className="page-container">
            <div className="notf-box responsive">
                <div className="notf-title theme text-color">We have sent a verification email to you!</div>
                <Components.DynamicImage dir="icon/" cls="email-icon responsive" alt="email" name="email.png"/>
                <div className="notf-msg theme text-color">Please check your inbox</div>
                <button className="notf-action" disabled={btnState} onClick={() => sendEmailVerification(auth.currentUser).then(() => {
                    console.log('success again');
                    setBtnState(true);
                    countdown(60);
                })}>{`Click to send the verification email again in ${timer}s`}</button>
            </div>
        </div>
    )
}