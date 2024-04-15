import { useEffect, useState, useRef, useCallback } from "react";
import { useGlobal } from "../scripts/global";
import "../css/use/greeting.css"
import { Functions, Hooks } from "../scripts/util";
import { useNavigate } from "react-router-dom";
import { auth } from "../scripts/firebase";
import { BgMusicController } from "./setup";
import { Components } from "../scripts/util";

const { Dynamic, HyperspaceTeleportationBackground } = Components;
const { Image } = Dynamic;

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
        let messageTimeout = [];
        const handleVisibilityChange = () => {
            if(document.hidden){
                for(const timeout of messageTimeout) clearTimeout(timeout);
                document.querySelector(".skip-intro").style.opacity = 0;
                document.querySelector(".skip-intro").style.pointerEvents = "none";
                setGreetMsgSize("");
                setGreetMsg("");
            }else{
                setGreetMsgSize("");
                setGreetMsg("");
                const total_msg_time_taken = (msg, extendTime=0) => getTypeWrittingTime(msg).total_phrase_erasing_time + getTypeWrittingTime(msg).total_phrase_writing_time + (2 * extendTime);
                messageTimeout = [
                    setTimeout(() => { document.querySelector(".hud-scifi-panel").style.opacity = 1; document.querySelector(".hud-scifi-panel").style.transform = "translateY(0)"; }, 500),
                    setTimeout(() => { setGreetMsgSize("large"); typeWriting(orderedGreetMsg[0], 2000); }, 2000),
                    setTimeout(() => { setGreetMsgSize("medium"); typeWriting(orderedGreetMsg[1], 2000); }, (2000 + total_msg_time_taken(orderedGreetMsg[0], 2000))),
                    setTimeout(() => { setGreetMsgSize("large"); typeWriting(orderedGreetMsg[2], 2000); }, (3500 + total_msg_time_taken(orderedGreetMsg[0], 2000) + total_msg_time_taken(orderedGreetMsg[1], 2000))),
                    setTimeout(() => { setGreetMsgSize("medium"); typeWriting(orderedGreetMsg[3], 3000); document.querySelector(".skip-intro").style.opacity = 1; document.querySelector(".skip-intro").style.pointerEvents = "auto"; }, (4500 + total_msg_time_taken(orderedGreetMsg[0], 2000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 2000))),
                    setTimeout(() => typeWriting(orderedGreetMsg[4], 3500), (6000 + total_msg_time_taken(orderedGreetMsg[0], 2000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 2000) + total_msg_time_taken(orderedGreetMsg[3], 3000))),
                    setTimeout(() => typeWriting(orderedGreetMsg[5], 4500), (10000 + total_msg_time_taken(orderedGreetMsg[0], 2000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 2000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500))),
                    setTimeout(() => typeWriting(orderedGreetMsg[6], 3000), (13000 + total_msg_time_taken(orderedGreetMsg[0], 2000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 2000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500) + total_msg_time_taken(orderedGreetMsg[5], 4500))),
                    setTimeout(() => typeWriting(orderedGreetMsg[7], 2000), (16000 + total_msg_time_taken(orderedGreetMsg[0], 2000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 2000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500) + total_msg_time_taken(orderedGreetMsg[5], 4500) + total_msg_time_taken(orderedGreetMsg[6], 3000))),
                    setTimeout(() => typeWriting(orderedGreetMsg[8], 2500), (19000 + total_msg_time_taken(orderedGreetMsg[0], 2000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 2000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500) + total_msg_time_taken(orderedGreetMsg[5], 4500) + total_msg_time_taken(orderedGreetMsg[6], 3000) + total_msg_time_taken(orderedGreetMsg[7], 2000))),
                    setTimeout(() => navigator("/registration"), (25000 + total_msg_time_taken(orderedGreetMsg[0], 2000) + total_msg_time_taken(orderedGreetMsg[1], 2000) + total_msg_time_taken(orderedGreetMsg[2], 2000) + total_msg_time_taken(orderedGreetMsg[3], 3000) + total_msg_time_taken(orderedGreetMsg[4], 3500) + total_msg_time_taken(orderedGreetMsg[5], 4500) + total_msg_time_taken(orderedGreetMsg[6], 3000) + total_msg_time_taken(orderedGreetMsg[7], 2000) + total_msg_time_taken(orderedGreetMsg[8], 2500)))
                ];
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);
        handleVisibilityChange();
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            for(const timeout of messageTimeout) clearTimeout(timeout);
        }
    }, []);

    return(
        <div className="page-container font-barlow spacify" style={{ justifyContent: "center", overflow: "hidden", backgroundImage: 'url("/imgs/backend-images/spaceship-cockpit.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPositionX: 'center' }}>
            <div className="setup">
                <BgMusicController />
            </div>
            <div className="greeting-dialog">
                <div className={`prompting-message ${greetMsgSize} responsive`}>{greetMsg}</div>
                <Image constant dir="/" name="hud-scifi-panel.png" alt="hud-scifi-panel" cls="hud-scifi-panel" />
            </div>
            <button className="skip-intro" onClick={async () => {
                document.querySelector(".prompting-message").style.opacity = 0;
                document.querySelector(".hud-scifi-panel").removeAttribute("style");
                await Functions.jobDelay(() => navigator("/registration"), 1000);
            }}>Skip intro</button>
            <HyperspaceTeleportationBackground />
        </div>
    )
}