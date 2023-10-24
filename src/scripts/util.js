import { useEffect, useState, useRef } from "react";
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

function useDelayedEffect(callback, dependencies, delay) {
    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    useEffect(() => {
      function tick() {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }
  
      const timerId = setTimeout(tick, delay);
  
      return () => clearTimeout(timerId);
    }, [...dependencies, delay]);
}
  
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
    const [timer, setTimer] = useState(3);

    useEffect(() => {
        if(props.auto){
            if(props.detect) Functions.jobDelay(() => {
                if(timer > 0) setTimer(prevT => {return prevT - 1});
                else{ setTimer(0); props.action(); }
            }, 1000);
        }
    }, [props.detect, timer])

    useDelayedEffect(() => {
        if(props.detect) document.getElementById("alert-box").showModal();
        else document.getElementById("alert-box").close();
    }, [props.detect], 500);

    return (
        <dialog id="alert-box" className="responsive theme container bg-color border-color">
            <div className="dialog-nester responsive">
                <h2 className="dialog-title theme text-color responsive">{props.messages.title}</h2>
                <label className="dialog-subtitle responsive theme text-color">{props.messages.subtitle || ""}</label>
                <div className="dialog-description responsive theme text-color">{props.messages.description || ""}</div>
                <button className="dialog-btn responsive" onClick={props.action}>{`${props.messages.action} ${timer}`}</button>
            </div>
        </dialog>
    );
};

const Functions = {
    asyncDelay,
    jobDelay,
    syncDelay
};

const Components = {
    DynamicImage,
    AlertBox
};

const Hooks = {
    useDelayedEffect
}

export { Functions, Components, Hooks };