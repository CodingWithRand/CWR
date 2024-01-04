"use server"

import "./page.css"
import "../global/css/responsive.css"
import { SignIn, SignUp, SwitchPageBtn } from "./components/client";
import Script from "next/script";

export default async function RegistrationPage() {
    return (
        <main>
            <Script src="/vanilla-js/frontend.js"/>
            <div className="bg-wrapper">
                <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="minimal-bg">
                    <polygon points="0,0 0,100
                    100,100 0,0" fill="black" style={{ opacity: 0 }} />
                </svg>
                <div className="init-dot">
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
                        <SignIn />
                    </div>
                    <div id="signup" className="reg-box">
                        <SignUp />
                    </div>
                </div>
                <SwitchPageBtn/>
            </div>
        </main>
    )
};