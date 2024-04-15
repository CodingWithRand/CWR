import { useNavigate } from "react-router-dom"
import { useGlobal } from "../scripts/global";
import { Components } from "../scripts/util";
import { signOut } from "@firebase/auth";
import { auth } from "../scripts/firebase";
import { useEffect, useMemo } from "react";
import { Functions } from "../scripts/util";
import Cookies from "universal-cookie";
import { SetUp } from "./setup";
import "../css/use/index.css";

const { AlertBox } = Components

function Stars() {
    const stars = useMemo(() => Array.from({ length: 100 }, (_, i) => { 
        const starSize = `${Math.floor(Math.random() * 10)}px`;
        const starColors = ["lightblue", "blue", "orangered", "gold", "white"];
        const pickedColor = Math.floor(Math.random() * starColors.length)
        return(
            <div key={i} className={`star ${starColors[pickedColor]}`} style={{ 
                top: `${Math.floor(Math.random() * 100)}%`, 
                left: `${Math.floor(Math.random() * 100)}%`,
                width: starSize,
                height: starSize,
            }}>
                <div className="atmosphere" style={{ boxShadow: `0px 0px ${starSize} ${starColors[pickedColor]}`} }></div>
            </div>
        )
    }), [])

    useEffect(() => {
        async function shineCore() { await Functions.asyncDelay(500); for(const star of document.querySelectorAll(".star")) await Functions.jobDelay(() => star.classList.add("shine"), 500) }
        async function shineAtmosphere() { await Functions.asyncDelay(500); for(const atmosphere of document.querySelectorAll(".star .atmosphere")) await Functions.jobDelay(() => atmosphere.classList.add("shine"), 500) }
        shineCore(); shineAtmosphere();
    }, [])

    return(
        <>{stars}</>
    )
}

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

    useEffect(() => {
        let effectTimeout = [];
        effectTimeout = [
            setTimeout(() => document.getElementById("b-b").classList.add("active"), 1000),
            setTimeout(() => document.getElementById("g-1").classList.add("active"), 5500),
            setTimeout(() => document.getElementById("g-2").classList.add("active"), 6000),
            setTimeout(() => document.getElementById("g-3").classList.add("active"), 6500),
            setTimeout(() => document.getElementById("g-4").classList.add("active"), 7000),
            setTimeout(() => document.getElementById("g-5").classList.add("active"), 7500),
            setTimeout(() => document.getElementById("g-6").classList.add("active"), 8000),
            setTimeout(() => document.getElementById("g-7").classList.add("active"), 8500),
            setTimeout(() => document.getElementById("g-8").classList.add("active"), 9000)
        ];
        return () => {
            for(const timeout of effectTimeout) clearTimeout(timeout);
        }
    }, []);

    return (
        <>
            <div className="page-container theme container bg-color">
            <div className="effect-backdrop">
                <div className="star-cluster">
                    <Stars />
                </div>
                <div className="big-uobj">
                    <div id="g-1" className="galaxy blueviolet">
                        <div id="l-1"></div>
                        <div id="l-2"></div>
                        <div id="l-3"></div>
                    </div>
                    <div id="g-2" className="galaxy blueviolet">
                        <div id="l-1"></div>
                        <div id="l-2"></div>
                        <div id="l-3"></div>
                    </div>
                    <div id="g-3" className="galaxy navy">
                        <div id="l-1"></div>
                        <div id="l-2"></div>
                        <div id="l-3"></div>
                    </div>
                    <div id="g-4" className="galaxy navy">
                        <div id="l-1"></div>
                        <div id="l-2"></div>
                        <div id="l-3"></div>
                    </div>
                    <div id="g-5" className="galaxy orangered">
                        <div id="l-1"></div>
                        <div id="l-2"></div>
                        <div id="l-3"></div>
                    </div>
                    <div id="g-6" className="galaxy orangered">
                        <div id="l-1"></div>
                        <div id="l-2"></div>
                        <div id="l-3"></div>
                    </div>
                    <div id="g-7" className="galaxy orangered">
                        <div id="l-1"></div>
                        <div id="l-2"></div>
                        <div id="l-3"></div>
                    </div>
                    <div id="g-8" className="galaxy gold">
                        <div id="l-1"></div>
                        <div id="l-2"></div>
                        <div id="l-3"></div>
                    </div>
                    <div id="b-b" className="big-bang">
                        <div id="l-1"></div>
                        <div id="l-2"></div>
                        <div id="l-3"></div>
                        <div id="l-4"></div>
                        <div id="l-5"></div>
                        <div id="l-6"></div>
                    </div>
                </div>
            </div>
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