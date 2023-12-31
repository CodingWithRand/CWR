"use client"

import "./page.css"
import { SignIn, SignUp } from "./component";
import { useEffect, useState } from "react";

export default function RegistrationPage() {
    const [ cometDeg, setCometDeg ] = useState(Math.atan2(window.innerHeight, window.innerWidth) * (180/Math.PI));
    const [ prevReflexsiveAngle, setPRA ] = useState(Math.atan2(window.innerHeight, window.innerWidth) * (180/Math.PI));

    window.onresize = () => {
        const reflexive_angle = Math.atan2(1.05 * window.innerHeight, window.innerWidth) * (180/Math.PI)
        console.log(prevReflexsiveAngle, reflexive_angle)
        setCometDeg((prevCometDeg) => prevCometDeg - (prevReflexsiveAngle - reflexive_angle));
        setPRA(reflexive_angle);
    }

    useEffect(() => {
        const init_dots_trail = document.querySelector(".init-dot > .trail");
        const triangle_bg = document.querySelector(".minimal-bg polygon");
        const login_pallete = document.querySelector(".login-pallete");
        const dice_logo = document.querySelector(".dice-logo");
        init_dots_trail.style.width = "5em";
        setTimeout(() => init_dots_trail.style.animation = "unstable-trail 2s linear infinite", 300);
        setTimeout(() => triangle_bg.style.opacity = 0.8, 1000);
        setTimeout(() => {
            login_pallete.style.transform = "translateY(0)";
            login_pallete.style.opacity = 1;
        }, 2000);
        setTimeout(() => dice_logo.style.animationName = "pop-up", 4000)
        setTimeout(() => {
            dice_logo.style.animationName = "shaking";
            dice_logo.style.animationIterationCount = "infinite"
            dice_logo.style.animationDirection = "alternate"
        }, 5000)
    }, []);

    return (
        <main>
            <div className="bg-wrapper">
                <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="minimal-bg">
                    <polygon points="0,0 0,100
                    100,100 0,0" fill="black" style={{ opacity: 0 }} />
                </svg>
                <div style={{transform: `rotate(${cometDeg}deg)`}} className="init-dot">
                    <div className="trail"></div>
                </div>
                <svg width="100px" height="100px" viewBox="0 0 100 100" className="dice-logo">
                    <rect width="100" height="100" x="0" rx="25" fill="lightgray" />
                    <circle cx="30" cy="70" r="10" fill="black" />
                    <circle cx="70" cy="30" r="10" fill="black" />
                </svg>
            </div>
            <div className="login-pallete" style={{ transform: "translateY(-20%)", opacity: 0 }}>
                <div className="reg-wrapper" focusing="login">
                    <div id="login" className="reg-box">
                        {/* <h1>Log In</h1>
                        <form>
                            <label htmlFor="username">Username</label>
                            <input name="username" placeholder="Your username here" />

                        </form> */}
                        <SignIn />
                    </div>
                    <div id="signup" className="reg-box">
                        {/* <h1>Sign Up</h1>
                        <form>
                            <label htmlFor="username">Username</label>
                            <input name="username" placeholder="Your desired username here" />
                        </form> */}
                        <SignUp />
                    </div>
                </div>
                <span id="registration-mode" onClick={() => {
                    const regwrapper = document.querySelector(".reg-wrapper");
                    if(regwrapper.getAttribute("focusing") === "login"){
                        regwrapper.style.transform = "translateX(-50%)";
                        document.getElementById("login").style.opacity = 0;
                        document.getElementById("signup").style.opacity = 1;
                        regwrapper.setAttribute("focusing", "signup");
                    }else if(regwrapper.getAttribute("focusing") === "signup"){
                        regwrapper.style.transform = "translateX(0%)";
                        document.getElementById("login").style.opacity = 1;
                        document.getElementById("signup").style.opacity = 0;
                        regwrapper.setAttribute("focusing", "login");
                    }
                }}>Don't have account? Create one!</span>

                {/* <!-- <div class="shadow"></div> --> */}
            </div>
        </main>
    )
};