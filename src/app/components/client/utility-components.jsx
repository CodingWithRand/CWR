import { useGlobal } from "@/app/global/client/global";
import { originContent, interestContent, learningStyle } from "./articleContents/paragraphs";
import { useEffect, useRef, useState } from "react";
import OriginBioCard from "./articleContents/media/origin-bio-card";
import Client from "@/app/global/client/util";
import ProgrammingInterest from "./articleContents/media/programming-interest";
import LearningStyle from "./articleContents/media/learning-style";

function ArticleMedia({ id }){
    switch(id){
        case "origin": return <OriginBioCard />
        case "interest": return <ProgrammingInterest />
        case "learning-style": return <LearningStyle />
    }
}

export function Article({ id, index }) {
    const { device } = useGlobal();

    useEffect(() => {
        for(const p of document.querySelectorAll(".content > article")){
            function handleShowParagraphScroll(){
                if(Client.Functions.isElementInViewport(p)){
                    p.style.transform = "translateY(0)";
                    p.style.opacity = 1;
                    window.removeEventListener("scroll", handleShowParagraphScroll);
                }
            }
            window.addEventListener("scroll", handleShowParagraphScroll);
            handleShowParagraphScroll();
        }
    }, [device.device])

    const showingParagraph = <article id={id}>
        {
            id === "origin" ? originContent :
            id === "interest" ? interestContent :
            id === "learning-style" ? learningStyle :
            <></>
        }
        <div className="fade"></div>
    </article>

    return (
        <>
            {index % 2 === 1 || (device.device === "sm" || device.device === "xs") ?
                <>
                    {showingParagraph}
                    <ArticleMedia id={id}/>
                </>
                :
                <>
                    <ArticleMedia id={id} />
                    {showingParagraph}
                </>
            }
        </>
    )
}

export function ProgressBarSparkle() {
    const [sparkles, setSparkles] = useState([]);

    useEffect(() => {
        const generateSparkles = () => {
            let newSparkles = [];
            let randomNumberOfSparkles = 0;
            while (randomNumberOfSparkles < 4) {
                randomNumberOfSparkles = Math.round(Math.random() * 8);
            }
            for (let i = 0; i < randomNumberOfSparkles; i++) {
                const randomSizeOfSparkles = Math.round(Math.random() * 6);
                const randomLeftPos = Math.round(Math.random() * 100);
                const randomTopPos = Math.round(Math.random() * 100);
                newSparkles.push(<div key={i} className="progress-bar-sparkle" style={{ width: randomSizeOfSparkles, height: randomSizeOfSparkles, left: `${randomLeftPos}%`, top: `${randomTopPos}%`, animationDelay: `${Math.random() * 2}s`}} />);
            }
            setSparkles(newSparkles);
        };

        generateSparkles();
    }, []);

    return sparkles;
}

function SkillBar({ abbrv, percent }){
    const { Image } = Client.Components.Dynamic;
    // const progressBar = useRef();
    const skillSection = useRef();
    
    // useEffect(() => {
    //     const observer = new MutationObserver((mutationsList) => {
    //         mutationsList.forEach((mutation) => {
    //             if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
    //                 if(skillSection.current.style?.opacity === "1"){
    //                     progressBar.current.style.width = `${percent}%`;
    //                 } else {
    //                     progressBar.current.style.width = 0;
    //                 }
    //             }
    //         })
    //     })
    //     observer.observe(skillSection.current, { attributes: true, attributeFilter: ['style'] });
    //     return () => observer.disconnect();
    // }, [])

    function getFullNameFromAbbrv(abbrv){
        switch(abbrv){
            case "js": return "JavaScript";
            case "ts": return "TypeScript";
            case "css": return "CSS";
            case "html": return "HTML";
            case "py": return "Python"; 
            case "lua": return "Lua";
            case "java": return "Java";
            case "php": return "PHP";
            case "cpp": return "C++";
            case "sql": return "SQL";
            case "react": return "React";
            case "next": return "Next.js";
            case "node": return "Node.js";
            case "exp": return "Express.js";
            case "fb": return "Firebase";
            case "an": return "Android Native";
            case "git": return "Git";
            case "tw": return "Tailwind CSS";
            case "ps": return "Problem Solving";
            case "a-lt": return "Algorithmic & Logical Thinking";
            case "td": return "Testing & Debugging";
            case "dm": return "Data Management";
            case "resp": return "Responsibility";
            case "int": return "Interactivity";
            case "ui-ux": return "UI/UX";
            case "cr": return "Creativity";
        }
    }

    return(
        <li ref={skillSection}>
            <Image title={getFullNameFromAbbrv(abbrv)} constant dir="icon/" cls="skill-icon" name={`${abbrv}.png`} alt={`${abbrv}-icon`} width={30} height={30}/>
            &nbsp;
            <span className="skill-icon-name" style={{ color: `var(--${abbrv}-color)`}}>{getFullNameFromAbbrv(abbrv)}</span>
            {/* <div className="progress-cover-bar" title={`${percent}%`} style={{ background: `
                var(--progress-bg-cover) padding-box,
                var(--${abbrv}-gradient-color) border-box
            ` }}>
                <div ref={progressBar} className="progress-bar" style={{ backgroundImage: `var(--${abbrv}-gradient-color)` }}>
                    <ProgressBarSparkle />
                </div>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-300" style={{ textShadow: "0 0 5px lightgray" }}>{percent}%</span>
            </div> */}
        </li>
    )
}

export function SkillsBarList({ id }){
    return(
        <li className="bg-neutral-100/50 p-2 nmob:p-4 my-4">
            <h2>
                {
                    (() => {
                        switch(id){
                            case "computer-languages": return "Computer Languages";
                            case "frameworks-libs-tools": return "Frameworks, Libraries & Tools";
                            case "technical-skills": return "Technical Skills";
                            case "designing-skills": return "Designing Skills";
                        }
                    })()
                } &nbsp;
                <Client.Components.Dynamic.Image 
                    cls="reveal-skills"
                    style={{display: "inline-block", rotate: "180deg"}}
                    name="sort-down.png"
                    dir="icon/"
                    width={15}
                    height={15}
                    alt="triangle-icon"
                    onClick={
                        function (e) {
                            const ol = document.getElementById(id);
                            if(e.target.style.rotate === "180deg") {
                                e.target.style.rotate = "0deg";
                                ol.style.display = "grid";
                                setTimeout(() => ol.style.opacity = 1, 500);
                                ol.childNodes.forEach((li, i) => {
                                    if(li.tagName === "LI"){
                                        setTimeout(() => {
                                            li.style.transform = "translateY(0)";
                                            li.style.opacity = 1;
                                        }, ((i+1) * 100) + 250);
                                    }
                                })
                            } else {
                                e.target.style.rotate = "180deg";
                                ol.style.opacity = 0;
                                setTimeout(() => ol.style.display = "none", 500)
                                ol.childNodes.forEach((li, i) => {
                                    if(li.tagName === "LI"){
                                        setTimeout(() => li.removeAttribute("style"), ((i+1) * 100) + 250);
                                    }
                                })
                            };
                        }
                    }
                />
            </h2>
            <ol id={id} style={{display: "none", gridTemplateColumns: "repeat(4, 1fr)", opacity: 0}}>
                {
                    (() => {
                        switch(id){
                            case "computer-languages":
                                return(
                                    <>
                                        <SkillBar abbrv="js" percent={60}/>
                                        <SkillBar abbrv="ts" percent={20}/>
                                        <SkillBar abbrv="css" percent={80}/>
                                        <SkillBar abbrv="html" percent={50}/>
                                        <SkillBar abbrv="py" percent={50}/>
                                        <SkillBar abbrv="lua" percent={60}/>
                                        <SkillBar abbrv="java" percent={25}/>
                                        <SkillBar abbrv="php" percent={10}/>
                                        <SkillBar abbrv="cpp" percent={10}/>
                                        <SkillBar abbrv="sql" percent={20}/>
                                    </>
                                )
                            case "frameworks-libs-tools":
                                return(
                                    <>
                                        <SkillBar abbrv="react" percent={35}/>
                                        <SkillBar abbrv="next" percent={30}/>
                                        <SkillBar abbrv="exp" percent={25}/>
                                        <SkillBar abbrv="node" percent={10}/>
                                        <SkillBar abbrv="fb" percent={20}/>
                                        <SkillBar abbrv="an" percent={5}/>
                                        <SkillBar abbrv="git" percent={15}/>
                                        <SkillBar abbrv="tw" percent={30}/>
                                    </>
                                )
                            case "technical-skills":
                                return(
                                    <>
                                        <SkillBar abbrv="ps" percent={50}/>
                                        <SkillBar abbrv="a-lt" percent={60}/>
                                        <SkillBar abbrv="td" percent={80}/>
                                        <SkillBar abbrv="dm" percent={40}/>
                                    </>
                                )
                            case "designing-skills":
                                return(
                                    <>
                                        <SkillBar abbrv="resp" percent={90}/>
                                        <SkillBar abbrv="int" percent={65}/>
                                        <SkillBar abbrv="ui-ux" percent={50}/>
                                        <SkillBar abbrv="cr" percent={45}/>
                                    </>
                                )
                        }
                    })()
                }
            </ol>
        </li>
    )
}

