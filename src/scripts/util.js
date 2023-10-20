import { useEffect, useState } from "react";
import { useGlobal } from "./global";

function async_delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); };
function sync_delay(ms) {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

function DynamicImage(props){
    const [{}, {theme}] = useGlobal();
    const [imgSrc, setImgSrc] = useState("");
    useEffect(() => {
        if(!props.constant) setImgSrc(process.env.PUBLIC_URL + `/imgs/backend-images/theme/${props.dir || ""}${theme}-${props.name}`);
        else setImgSrc(process.env.PUBLIC_URL + `/imgs/backend-images/${props.dir || ""}${props.name}`);
    }, [theme]);
    
    return <img alt={props.alt} src={imgSrc} className={props.cls} />;
}

const functions = {
    async_delay,
    sync_delay,
}

const Components = {
    DynamicImage
}

export { functions, Components }