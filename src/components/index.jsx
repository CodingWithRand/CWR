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
    const stars = useMemo(() => Array.from({ length: 1000 }, (_, i) => { 
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
        async function shineCore() { 
            if(!localStorage.getItem("bigbanged")) await Functions.asyncDelay(50);
            for(const star of document.querySelectorAll(".star")){
                if(!localStorage.getItem("bigbanged")) await Functions.asyncDelay(50);
                star.classList.add("shine");
            }
        }
        async function shineAtmosphere() {
            await Functions.asyncDelay(50);
            for(const atmosphere of document.querySelectorAll(".star .atmosphere")){
                if(!localStorage.getItem("bigbanged")) await Functions.asyncDelay(50);
                atmosphere.classList.add("shine");
            }
        }
        shineCore(); shineAtmosphere();
    }, [])

    return(
        <>{stars}</>
    )
}

function universalExpand(){
    document.querySelector(".star-cluster").style.width = "500vw";
    document.querySelector(".star-cluster").style.height = "500vh";
    document.querySelector(".big-uobj").style.width = "200vw";
    document.querySelector(".big-uobj").style.height = "200vh";
    document.querySelector(".big-uobj").style.top = "50%";
    document.querySelector(".big-uobj").style.left = "50%";
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
        if(!localStorage.getItem("bigbanged")){
            localStorage.setItem("bigbanged", true);
            effectTimeout = [
                setTimeout(() => document.getElementById("b-b").classList.add("active"), 1000),
                setTimeout(() => document.getElementById("g-1").classList.add("active"), 5500),
                setTimeout(() => document.getElementById("g-2").classList.add("active"), 6000),
                setTimeout(() => document.getElementById("g-3").classList.add("active"), 6500),
                setTimeout(() => document.getElementById("g-4").classList.add("active"), 7000),
                setTimeout(() => document.getElementById("g-5").classList.add("active"), 7500),
                setTimeout(() => document.getElementById("g-6").classList.add("active"), 8000),
                setTimeout(() => document.getElementById("g-7").classList.add("active"), 8500),
                setTimeout(() => document.getElementById("g-8").classList.add("active"), 9000),
                setTimeout(universalExpand, 10000),
            ];
        }else{
            for(let i = 1; i<9; i++) document.getElementById(`g-${i}`).classList.add("active");
            universalExpand()
        }
        return () => {
            for(const timeout of effectTimeout) clearTimeout(timeout);
        }
    }, []);

    return (
        <>
            <div className="page-container" style={{ backgroundColor: "rgb(20,18,26)" }}>
                <div className="effect-backdrop">
                    <div className="star-cluster">
                        <Stars />
                    </div>
                    <div className="big-uobj">
                        <div id="g-1" className="galaxy blueviolet">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <button id="s-1" className="stage" />
                        </div>
                        <div id="g-2" className="galaxy blueviolet">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <button id="s-2" className="stage" />
                        </div>
                        <div id="g-3" className="galaxy navy">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <button id="s-3" className="stage" />
                        </div>
                        <div id="g-4" className="galaxy navy">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <button id="s-4" className="stage" />
                        </div>
                        <div id="g-5" className="galaxy orangered">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <button id="s-5" className="stage" />
                        </div>
                        <div id="g-6" className="galaxy orangered">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <button id="s-6" className="stage" />
                        </div>
                        <div id="g-7" className="galaxy orangered">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <button id="s-7" className="stage" />
                        </div>
                        <div id="g-8" className="galaxy gold">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <button id="s-8" className="stage" />
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