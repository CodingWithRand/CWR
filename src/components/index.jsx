import { useNavigate } from "react-router-dom"
import { useGlobal } from "../scripts/global";
import { Components } from "../scripts/util";
import { signOut } from "@firebase/auth";
import { auth } from "../scripts/firebase";
import { useEffect } from "react";
import Cookies from "universal-cookie";

const { AlertBox } = Components

export default function IndexHomepage() {
    const cookies = new Cookies();
    const navigator = useNavigate();
    const { login } = useGlobal();

    useEffect(() => {
        if(!cookies.get("watchedIntro")){
            cookies.set("watchedIntro", true, { path: "/", maxAge: 7 * 24 * 60 * 60 })
            navigator("/intro?redirectFrom=homepage");
        }
    }, [login.isLoggedIn, cookies.get("watchedIntro")])

    return (
        <>
            <div className="page-container theme container bg-color">
                <AlertBox id="session-expired" auto detect={(login.isLoggedIn === "undefined" || login.isLoggedIn === false) && (cookies.get("login") === "undefined" || cookies.get("login") === false)} 
                messages={{
                    title: "Your session has expired.",
                    subtitle: "Please sign in again!",
                    action: "Sign out in"
                }} 
                action={() => {
                    navigator("/registration");
                    signOut(auth);
                }}/>
            </div>
            <SetUp/>
        </>
        
    )
}