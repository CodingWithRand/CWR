"use client"

import { useEffect } from "react";
import "./client.css"
import { useSearchParams } from "next/navigation";

export default function SwitchPageBtn(){
    const searchParams = useSearchParams();
    const regPage = searchParams.get("page")
    let regwrapper, regmode;

    function swipeToSignup(){
        regwrapper.style.transform = "translateX(-52%)";
        document.getElementById("login").style.opacity = 0;
        document.getElementById("signup").style.opacity = 1;
        regwrapper.setAttribute("focusing", "signup");
        regmode.textContent = "Already have an account? Login now!"
    };

    function swipeToLogin(){
        regwrapper.style.transform = "translateX(0%)";
        document.getElementById("login").style.opacity = 1;
        document.getElementById("signup").style.opacity = 0;
        regwrapper.setAttribute("focusing", "login");
        regmode.textContent = "Don't have account? Create one!"
    };

    useEffect(() => {
        regwrapper = document.querySelector(".reg-wrapper");
        regmode = document.getElementById("registration-mode");
        if(regPage === "login") swipeToLogin();
        else if(regPage === "register") swipeToSignup();
    }, []);

    return(
        <span id="registration-mode" className="responsive" onClick={() => {
            if(regwrapper.getAttribute("focusing") === "login") swipeToSignup();
            else if(regwrapper.getAttribute("focusing") === "signup") swipeToLogin();
        }}>Don&apos;t have account? Create one!</span>
    )
}