import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useGlobal } from "../scripts/global";
import "../css/use/greeting.css"
import { Functions, Hooks } from "../scripts/util";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../scripts/firebase";
import { BgMusicController } from "./setup";

const useDocumentShowingState = () => {
    const mountedRef = useRef(false)
    const isShowing = useCallback(() => mountedRef.current, [])
  
    useEffect(() => {
      mountedRef.current = true;
      const dh = () => {
        if(document.hidden){
            mountedRef.current = false;
        }else{
            mountedRef.current = true;
        }
      };
      window.addEventListener('visibilitychange', dh);
      dh();
      return () => window.removeEventListener('visibilitychange', dh);
    }, [])
  
    return isShowing
}

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
    const isShowing = useDocumentShowingState();
    const { login } = useGlobal();
    const navigator = useNavigate();
    const orderedGreetMsg = [
        "Greeting Traveler...", 
        "I am the owner of this place, you may call me \"Rand\"", 
        "I'm really glad you visit my place",
        "Although, I don't know your name yet. I'm going to introduce you this place a bit...",
        "This place contains all of my programming lessons. It's pretty much like a programming institution website.",
        "The lessons begin with the basic programming concepts and related technology, and then move to more advanced ones.",
        "Those lessons I've created will be uploaded on YouTube which I'd explain furthermore how they work...",
        "I've designed this website to look like a journal game, I hope you'll like it.",
        "All right, I know it's lame to read this animationed text. I'm bringing you to the next session now."
    ]
    const [ greetMsgSize, setGreetMsgSize ] = useState("");
    const [ greetMsg, setGreetMsg ] = useState("");
    Hooks.useDelayedEffect(() => {
        if(login.isLoggedIn && auth.currentUser?.emailVerified){ navigator("/"); };
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
            if(isShowing()) await writeCharacter(l, delay);
            else return;
        };

        await Functions.asyncDelay(extendTime);
        for(let i = 0; i<Array.from(msg).length; i++){
            if(isShowing()) await eraseCharacter(50);
            else return;
        }
        await Functions.asyncDelay(extendTime);
    }

    useEffect(() => {
        let effectTimeout = [];
        let messageTimeout = [];
        const handleVisibilityChange = () => {
            if(document.hidden){
                for(const timeout of messageTimeout) clearTimeout(timeout);
                for(const timeout of effectTimeout) clearTimeout(timeout);
                for(let i = 1; i<9; i++) document.getElementById(`g-${i}`).classList.remove("active");
                document.getElementById("oc").classList.remove("ort-cloud");
                document.querySelector(".skip-intro").style.opacity = 0;
                document.querySelector(".skip-intro").style.pointerEvents = "none";
                setGreetMsgSize("");
                setGreetMsg("");
            }else{
                setGreetMsgSize("");
                setGreetMsg("");
                const total_msg_time_taken = (msg, extendTime=0) => getTypeWrittingTime(msg).total_phrase_erasing_time + getTypeWrittingTime(msg).total_phrase_writing_time + (2 * extendTime);
                messageTimeout = [
                    setTimeout(() => { setGreetMsgSize("large"); typeWriting(orderedGreetMsg[0], 1000); }, 2000),
                    setTimeout(() => { setGreetMsgSize("medium"); typeWriting(orderedGreetMsg[1], 2000); }, (2000 + total_msg_time_taken(orderedGreetMsg[0], 1000))),
                    setTimeout(() => { setGreetMsgSize("large"); typeWriting(orderedGreetMsg[2], 1000); }, (2000 + total_msg_time_taken(orderedGreetMsg[0], 1000) + total_msg_time_taken(orderedGreetMsg[1], 2000))),
                    setTimeout(() => { setGreetMsgSize("medium"); typeWriting(orderedGreetMsg[3], 3000); }, (2000 + total_msg_time_taken(orderedGreetMsg[0], 1000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 1000))),
                    setTimeout(() => typeWriting(orderedGreetMsg[4], 3500), (2000 + total_msg_time_taken(orderedGreetMsg[0], 1000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 1000) + total_msg_time_taken(orderedGreetMsg[3], 3000))),
                    setTimeout(() => typeWriting(orderedGreetMsg[5], 4500), (2000 + total_msg_time_taken(orderedGreetMsg[0], 1000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 1000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500))),
                    setTimeout(() => typeWriting(orderedGreetMsg[6], 3000), (2000 + total_msg_time_taken(orderedGreetMsg[0], 1000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 1000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500) + total_msg_time_taken(orderedGreetMsg[5], 4500))),
                    setTimeout(() => typeWriting(orderedGreetMsg[7], 2000), (2000 + total_msg_time_taken(orderedGreetMsg[0], 1000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 1000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500) + total_msg_time_taken(orderedGreetMsg[5], 4500) + total_msg_time_taken(orderedGreetMsg[6], 3000))),
                    setTimeout(() => typeWriting(orderedGreetMsg[8], 2500), (2000 + total_msg_time_taken(orderedGreetMsg[0], 1000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 1000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500) + total_msg_time_taken(orderedGreetMsg[5], 4500) + total_msg_time_taken(orderedGreetMsg[6], 3000) + total_msg_time_taken(orderedGreetMsg[7], 2000))),
                    setTimeout(() => document.getElementById("b-b").classList.add("active"), (2000 + total_msg_time_taken(orderedGreetMsg[0], 1000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 1000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500) + total_msg_time_taken(orderedGreetMsg[5], 4500) + total_msg_time_taken(orderedGreetMsg[6], 3000) + total_msg_time_taken(orderedGreetMsg[7], 2000) + total_msg_time_taken(orderedGreetMsg[8], 2500))),
                    setTimeout(() => navigator("/registration"), (2000 + total_msg_time_taken(orderedGreetMsg[0], 1000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 1000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500) + total_msg_time_taken(orderedGreetMsg[5], 4500) + total_msg_time_taken(orderedGreetMsg[6], 3000) + total_msg_time_taken(orderedGreetMsg[7], 2000) + total_msg_time_taken(orderedGreetMsg[8], 2500) + 11111))
                ];
                effectTimeout = [
                    setTimeout(() => document.querySelector("#oc").classList.add("ort-cloud"), 1500),
                    setTimeout(() => document.getElementById("g-1").classList.add("active"), 6500),
                    setTimeout(() => document.getElementById("g-2").classList.add("active"), 11000),
                    setTimeout(() => {
                        const skipBtn = document.querySelector(".skip-intro")
                        skipBtn.style.opacity = 1;
                        skipBtn.style.pointerEvents = "auto";
                    }, 16000),
                    setTimeout(() => document.getElementById("g-3").classList.add("active"), 23500),
                    setTimeout(() => document.getElementById("g-4").classList.add("active"), 31500),
                    setTimeout(() => document.getElementById("g-5").classList.add("active"), 40300),
                    setTimeout(() => document.getElementById("g-6").classList.add("active"), 49300),
                    setTimeout(() => document.getElementById("g-7").classList.add("active"), 59300),
                    setTimeout(() => document.getElementById("g-8").classList.add("active"), 74300)
                ];
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);
        handleVisibilityChange();
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    return(
        <div className="page-container font-barlow spacify" style={{ justifyContent: "center" }}>
            <div className="setup">
                <BgMusicController />
            </div>
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
            <Link to="/registration"><a className="skip-intro">Skip intro</a></Link>
        </div>
    )
}