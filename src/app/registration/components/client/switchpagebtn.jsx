"use client"

import "./client.css"

export default function SwitchPageBtn(){
    return(
        <span id="registration-mode" className="responsive" onClick={(e) => {
            const regwrapper = document.querySelector(".reg-wrapper");
            if(regwrapper.getAttribute("focusing") === "login"){
                regwrapper.style.transform = "translateX(-50%)";
                document.getElementById("login").style.opacity = 0;
                document.getElementById("signup").style.opacity = 1;
                regwrapper.setAttribute("focusing", "signup");
                e.target.textContent = "Already have an account? Login now!"
            }else if(regwrapper.getAttribute("focusing") === "signup"){
                regwrapper.style.transform = "translateX(0%)";
                document.getElementById("login").style.opacity = 1;
                document.getElementById("signup").style.opacity = 0;
                regwrapper.setAttribute("focusing", "login");
                e.target.textContent = "Don't have account? Create one!"
            }
        }}>Don&apos;t have account? Create one!</span>
    )
}