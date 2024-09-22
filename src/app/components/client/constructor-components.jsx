"use client"

import { useEffect } from "react"
import { useGlobal } from "@/glient/global";
import Script from "next/script";
import Client from "@/glient/util"
import Neutral from "@/geutral/util";
import { ProgressBarSparkle, SkillsBarList } from "./utility-components";

function Header(){
    return(
        <header id="banner">
            <div id="logo">
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", flexDirection: "row", columnGap: "5em"}}>
                <svg width="200" height="200" id="dice">
                    <rect width="200" height="200" rx="20" ry="20" fill="lightgray"></rect>
                    <circle cx="50" cy="50" r="20" fill="black" className="d four five six" style={{display: "none"}}></circle>
                    <circle cx="150" cy="150" r="20" fill="black" className="d four five six" style={{display: "none"}}></circle>
                    <circle cx="100" cy="100" r="20" fill="black" className="d one three five"></circle>
                    <circle cx="50" cy="100" r="20" fill="black" className="d six" style={{display: "none"}}></circle>
                    <circle cx="150" cy="100" r="20" fill="black" className="d six" style={{display: "none"}}></circle>
                    <circle cx="50" cy="150" r="20" fill="black" className="d two three four five six" style={{display: "none"}}></circle>
                    <circle cx="150" cy="50" r="20" fill="black" className="d two three four five six" style={{display: "none"}}></circle>
                </svg>
                <span id="logo-text">
                    CWR
                    <div className="fade"></div>
                </span>
            </div>   
            <div className="line"></div>
            <h2 className="subtitle">Present</h2> 
            </div>
            <div className="caption">My Programming Portfolio</div>
            <a href="#about-me" id="proceed" className="absolute bottom-4 w-full opacity-0 flex flex-col items-center text-black dark:text-white">
                <span>Click here to proceed</span>
                <Client.Components.Dynamic.Image width={30} height={30} dir="icon/" name="sort-down.png" alt="arrow-icon" />
            </a>
            <Script async src="vanilla-js/frontend/index.js" type="application/javascript" />
        </header>
    )
}

export function Intro(){
    const { authUser } = useGlobal();
    return(
        <Client.Components.SuspenseComponent condition={authUser.isAuthUser !== undefined} cover loadingComponent={<Neutral.Components.LoadingPage />}>
            <Client.Components.NavBar />
            <Header />
        </Client.Components.SuspenseComponent>
    )
}

export function SkillsBlock(){
    const { device } = useGlobal();

    useEffect(() => {
        const sb = document.getElementById("skills-block");
        const clbs = document.querySelectorAll("#skills-block ul > li");
        const sbth2s = document.querySelectorAll("#skills-block ul > li:not(#dev-type) h2");
        const revealSkills = document.querySelectorAll("#skills-block .reveal-skills");

        function handleShowParagraphScroll(){
            if(Client.Functions.isElementInViewport(sb)){
                sb.style.transform = "translateY(0)";
                sb.style.opacity = 1;
                clbs.forEach((clb, i) => {
                    setTimeout(() => {
                        clb.style.transform = "translateY(0)";
                        clb.style.opacity = 1;
                    }, (i+1) * 250);
                    if(clb.querySelector("#measurement-stick")){
                        setTimeout(() => {
                            clb.querySelector("#measurement-stick").style.opacity = 1;
                            clb.querySelector("#measurement-stick").style.left = "34%";
                        }, (i+1) * 300);
                    }
                })
                sbth2s.forEach((sbth2, i) => {
                    setTimeout(() => {
                        sbth2.style.transform = "translateY(0)";
                        sbth2.style.opacity = 1;
                    }, (i+1) * 500);
                })
                revealSkills.forEach((revealSkill, i) => {
                    setTimeout(() => {
                        if(revealSkill.style.rotate === "180deg") revealSkill.click()
                    }, (i+1) * 1000);
                });
                window.removeEventListener("scroll", handleShowParagraphScroll);
            }
        }
        window.addEventListener("scroll", handleShowParagraphScroll);
        handleShowParagraphScroll();

        return () => window.removeEventListener("scroll", handleShowParagraphScroll);

    }, [device.device]);

    return(
        <div id="skills-block">
            <h1 className="text-center text-[3em]" style={{ color: "white" }}>My Skills</h1>
            <ul>
                <SkillsBarList id="computer-languages"/>
                <SkillsBarList id="frameworks-libs-tools"/>
                <SkillsBarList id="technical-skills"/>
                <SkillsBarList id="designing-skills" />
                {/* <li id="dev-type" className="text-center my-4 p-4">
                    <h2 className="text-base nmob:text-[1.45em] sm:text-[2em]" style={{ color: "white" }}>I&apos;m considered a...</h2>
                    <div className="progress-cover-bar mt-8 mb-4" style={{ width: "100%", background: `
                        var(--progress-bg-cover) padding-box,
                        linear-gradient(45deg, rgb(255, 255, 100) 33%, rgb(0, 255, 200) 66%, rgb(12, 120, 0) 99%) border-box
                    ` }}>
                        <div id="measurement-stick" className="h-[200%] top-[-50%] left-0 w-2 rounded-full absolute bg-red-500 z-10 opacity-0" style={{ transition: "left 1s 0.5s ease-out, opacity 1s ease-out" }}></div>
                        <div className="progress-bar" style={{ width: "100%", backgroundImage: "linear-gradient(45deg, rgb(255, 255, 100) 33%, rgb(0, 255, 200) 66%, rgb(12, 120, 0) 99%)" }}>
                            <ProgressBarSparkle />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-x-4">
                        <span className="text-left text-xs md:text-base" style={{ color: "white" }}>Front-End Developer</span>
                        <span className="text-center text-xs md:text-base" style={{ color: "white" }}>Full-Stack Developer</span>
                        <span className="text-right text-xs md:text-base" style={{ color: "white" }}>Back-End Developer</span>
                    </div>
                </li> */}
            </ul>
        </div>
    )
}