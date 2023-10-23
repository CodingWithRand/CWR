import { useEffect, useState } from "react";
import { useGlobal } from "./global";
import "../css/use/util.css";
import "../css/use/theme.css";
import "../css/use/responsive.css";

async function asyncDelay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); };
async function jobDelay(callback, ms){
    let timeoutId;
    await new Promise((resolve) => {
        timeoutId = setTimeout(() => {
            callback();
            resolve();
        }, ms);
    });
    clearTimeout(timeoutId);
};

function syncDelay(ms) {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
        now = Date.now();
    };
};

function DynamicImage(props){
    const [{theme}] = useGlobal();
    const [imgSrc, setImgSrc] = useState("");
    useEffect(() => {
        if(!props.constant) setImgSrc(process.env.PUBLIC_URL + `/imgs/backend-images/theme/${props.dir || ""}${theme}-${props.name}`);
        else setImgSrc(process.env.PUBLIC_URL + `/imgs/backend-images/${props.dir || ""}${props.name}`);
    }, [theme]);
    
    return <img alt={props.alt} src={imgSrc} className={props.cls} />;
};

function AlertBox(props){
    
    useEffect(() => {
        switch(props.mode){
            case "catch":
                const intervalId = setInterval(() => {
                    if(props.detect) document.getElementById("alert-box").showModal();
                }, 1000);
                return () => clearInterval(intervalId);
            default:
                if(props.detect) document.getElementById("alert-box").showModal();
        };
    }, [props.detect]);

    return (
        <dialog id="alert-box" className="responsive theme container bg-color border-color">
            <div className="dialog-nester responsive">
                <h2 className="dialog-title theme text-color responsive">{props.messages.title}</h2>
                <label className="dialog-subtitle responsive theme text-color">{props.messages.subtitle || ""}</label>
                <div className="dialog-description responsive theme text-color">{props.messages.description || ""}</div>
                <button className="dialog-btn responsive" onClick={props.action}>Sign out</button>
            </div>
        </dialog>
    );
};

const functions = {
    asyncDelay,
    jobDelay,
    syncDelay
};

const Components = {
    DynamicImage,
    AlertBox
};

export { functions, Components };