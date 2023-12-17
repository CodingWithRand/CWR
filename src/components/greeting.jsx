import { useEffect, useState, useMemo } from "react";
import { useGlobal } from "../scripts/global";
import "../css/use/greeting.css"
import { Functions, Hooks } from "../scripts/util";
import { useNavigate } from "react-router-dom";
import { auth } from "../scripts/firebase";

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
        async function shineCore() { await Functions.asyncDelay(2000); for(const star of document.querySelectorAll(".star")) await Functions.jobDelay(() => star.classList.add("shine"), 500) }
        async function shineAtmosphere() { await Functions.asyncDelay(2000); for(const atmosphere of document.querySelectorAll(".star .atmosphere")) await Functions.jobDelay(() => atmosphere.classList.add("shine"), 500) }
        shineCore(); shineAtmosphere();
    }, [])

    return(
        <>{stars}</>
    )
}

export default function Greet(){
    const navigator = useNavigate();
    const orderedGreetMsg = [
        "Greeting Traveler...", 
        "I am the owner of this place, you may call me \"Rand\"", 
        "I'm really glad you visit my place",
        "Although, I don't know your name yet. I'm going to introduce you this place a bit...",
        "This place contains all of my programming projects. It's pretty much like a portfolio website.",
        "Of course, these projects are open-source. You can fork my codes in GitHub and learn them for free if you want. But not only just my programming projects are here, there are also some programming related lessons that I've created by myself.",
        "Those lessons I've created will be uploaded on YouTube which I'd explain furthermore how they work...",
        "All right, I know it's lame to read this animationed text. I'm bringing you to the next session now."
    ]
    const [ greetMsgSize, setGreetMsgSize ] = useState("");
    const [ greetMsg, setGreetMsg ] = useState("");
    const { exceptionPage, login } = useGlobal();
    useEffect(() => { exceptionPage.setOnExceptionPage(true) }, []);
    Hooks.useDelayedEffect(() => {
        if(login.isLoggedIn && auth.currentUser?.emailVerified){ navigator("/"); window.location.reload(); };
    }, [login.isLoggedIn], 100);
    

    function getTypeWrittingTime(msg){
        let total_phrase_writing_time = 0;
        let total_phrase_erasing_time = 0;
        Array.from(msg).forEach((l) => {
            if(l === "."){ total_phrase_writing_time += 200; total_phrase_erasing_time += 50; }
            else{ total_phrase_writing_time += 50; total_phrase_erasing_time += 50; }
        });

        return { total_phrase_writing_time, total_phrase_erasing_time }
    }

    async function typeWriting(msg, extendTime=0){

        async function writeCharacter(l, delay) {
            return new Promise((resolve) => {
                Functions.jobDelay(() => {
                    setGreetMsg((prevGreetMsg) => prevGreetMsg + l);
                    resolve();
                }, delay);
            });
        }
        
        async function eraseCharacter(delay) {
            return new Promise((resolve) => {
                Functions.jobDelay(() => {
                    setGreetMsg((prevGreetMsg) => {
                        let prevGreetMsgArray = Array.from(prevGreetMsg);
                        prevGreetMsgArray.pop();
                        return prevGreetMsgArray.join("");
                    });
                    resolve();
                }, delay);
            });
        }

        for(const l of msg) {
            const delay = l === "." ? 200 : 50;
            await writeCharacter(l, delay);
        };

        await Functions.asyncDelay(extendTime);
        for(let i = 0; i<Array.from(msg).length; i++) await eraseCharacter(50)
        await Functions.asyncDelay(extendTime);
    }

    useEffect(() => {
        if(document.hidden) Functions.asyncDelay(2000).then(() => window.location.reload());
        const total_msg_time_taken = (msg, extendTime=0) => getTypeWrittingTime(msg).total_phrase_erasing_time + getTypeWrittingTime(msg).total_phrase_writing_time + (2 * extendTime);
        async function messageShow () {
            await Functions.jobDelay(() => { setGreetMsgSize("large"); typeWriting(orderedGreetMsg[0], 1000) }, 2000);
            await Functions.jobDelay(() => { setGreetMsgSize("medium"); typeWriting(orderedGreetMsg[1], 2000) }, (total_msg_time_taken(orderedGreetMsg[0], 1000)));
            await Functions.jobDelay(() => { setGreetMsgSize("large"); typeWriting(orderedGreetMsg[2], 1000) }, (total_msg_time_taken(orderedGreetMsg[1], 2000)));
            await Functions.jobDelay(() => { setGreetMsgSize("medium"); typeWriting(orderedGreetMsg[3], 3000) }, (total_msg_time_taken(orderedGreetMsg[2], 1000)));
            await Functions.jobDelay(() => typeWriting(orderedGreetMsg[4], 3500), (total_msg_time_taken(orderedGreetMsg[3], 3000)));
            await Functions.jobDelay(() => typeWriting(orderedGreetMsg[5], 6000), (total_msg_time_taken(orderedGreetMsg[4], 3500)));
            await Functions.jobDelay(() => typeWriting(orderedGreetMsg[6], 3000), (total_msg_time_taken(orderedGreetMsg[5], 6000)));
            await Functions.jobDelay(() => typeWriting(orderedGreetMsg[7], 2000), (total_msg_time_taken(orderedGreetMsg[6], 3000)));
            await Functions.jobDelay(() => document.getElementById("b-b").classList.add("active"), (total_msg_time_taken(orderedGreetMsg[7], 2000)));
            await Functions.jobDelay(() => navigator("/registration"), 11111);
        };
        async function effectShow () {
            await Functions.jobDelay(() => document.querySelector("#oc")?.classList.add("ort-cloud"), 1500);
            await Functions.jobDelay(() => document.getElementById("g-1")?.classList.add("active"), 4000);
            await Functions.jobDelay(() => document.getElementById("g-2")?.classList.add("active"), 4500);
            await Functions.jobDelay(() => {
                const skipBtn = document.querySelector(".skip-intro")
                skipBtn.style.opacity = 1;
                skipBtn.setAttribute("href", "/registration");
            }, 5000);
            await Functions.jobDelay(() => document.getElementById("g-3")?.classList.add("active"), 7500);
            await Functions.jobDelay(() => document.getElementById("g-4")?.classList.add("active"), 8000);
            await Functions.jobDelay(() => document.getElementById("g-5")?.classList.add("active"), 8800);
            await Functions.jobDelay(() => document.getElementById("g-6")?.classList.add("active"), 9000);
            await Functions.jobDelay(() => document.getElementById("g-7")?.classList.add("active"), 10000);
            await Functions.jobDelay(() => document.getElementById("g-8")?.classList.add("active"), 15000);
        };

        messageShow(); effectShow();
    }, [document.hidden]);

    return(
        <div className="page-container font-barlow spacify" style={{ justifyContent: "center" }}>
            <div className="effect-backdrop">
                <div className="star-cluster">
                    <Stars />
                </div>
                <div className="big-uobj">
                    <div id="oc"></div>
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
            <div className="greeting-dialog">
                <div className={`prompting-message ${greetMsgSize}`}>{greetMsg}</div>
            </div>
            <a className="skip-intro">Skip intro</a>
        </div>
    )
}