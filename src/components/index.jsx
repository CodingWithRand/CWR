import { useLocation, useNavigate } from "react-router-dom"
import { useGlobal } from "../scripts/global";
import { Components } from "../scripts/util";
import { signOut } from "@firebase/auth";
import { auth } from "../scripts/firebase";
import { useEffect, useMemo, useRef } from "react";
import { Functions } from "../scripts/util";
import Cookies from "universal-cookie";
import { SetUp } from "./setup";
import "../css/use/index.css";

const { AlertBox, Dynamic } = Components
const { Image } = Dynamic

function Stars() {
    const stars = useMemo(() => Array.from({ length: 1000 }, (_, i) => { 
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
        async function shineCore() { 
            if(!localStorage.getItem("bigbanged")) await Functions.asyncDelay(50);
            for(const star of document.querySelectorAll(".star")){
                if(!localStorage.getItem("bigbanged")) await Functions.asyncDelay(50);
                star.classList.add("shine");
            }
        }
        async function shineAtmosphere() {
            await Functions.asyncDelay(50);
            for(const atmosphere of document.querySelectorAll(".star .atmosphere")){
                if(!localStorage.getItem("bigbanged")) await Functions.asyncDelay(50);
                atmosphere.classList.add("shine");
            }
        }
        shineCore(); shineAtmosphere();
    }, [])

    return(
        <>{stars}</>
    )
}

function universalExpand(){
    document.querySelector(".star-cluster").style.width = "500vw";
    document.querySelector(".star-cluster").style.height = "500vh";
    document.querySelector(".big-uobj").style.width = "200vw";
    document.querySelector(".big-uobj").style.height = "200vh";
    document.querySelector(".big-uobj").style.top = "50%";
    document.querySelector(".big-uobj").style.left = "50%";
}

function scrollableUniverse(){
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;

    const scrollContainer = document.querySelector('.effect-backdrop');

    function handleContainerMouseDown(e){
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startScrollLeft = scrollContainer.scrollLeft;
        startScrollTop = scrollContainer.scrollTop;
    }

    function handleDocumentMouseMove(e){
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        scrollContainer.scrollLeft = startScrollLeft - deltaX;
        scrollContainer.scrollTop = startScrollTop - deltaY;
    }

    function handleDocumentScrollEnd() { isDragging = false };

    function handleContainerTouchStart(e) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startScrollLeft = scrollContainer.scrollLeft;
        startScrollTop = scrollContainer.scrollTop;
    }

    function handleContainerTouchMove(e) {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        scrollContainer.scrollLeft = startScrollLeft - deltaX;
        scrollContainer.scrollTop = startScrollTop - deltaY;
        e.preventDefault(); // Prevent page scroll on touchmove
    }

    scrollContainer.removeEventListener('mousedown', handleContainerMouseDown);
    document.removeEventListener('mousemove', handleDocumentMouseMove);
    document.removeEventListener('mouseup', handleDocumentScrollEnd);

    scrollContainer.removeEventListener('touchstart', handleContainerTouchStart);
    document.removeEventListener('touchmove', handleContainerTouchMove);
    document.removeEventListener('touchend', handleDocumentScrollEnd);

    scrollContainer.addEventListener('mousedown', handleContainerMouseDown);
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentScrollEnd);

    scrollContainer.addEventListener('touchstart', handleContainerTouchStart);
    document.addEventListener('touchmove', handleContainerTouchMove);
    document.addEventListener('touchend', handleDocumentScrollEnd);
}

function closeAllSinfs(exceptSinf=undefined){
    for(const sinf of document.querySelectorAll(".stage-info")){
        if(exceptSinf && exceptSinf === sinf) continue;
        sinf.removeAttribute("style");
        setTimeout(() => sinf.close(), 500);
    };
}

function Stage(props){
    const navigator = useNavigate();
    return(
        <div className={`stage ${props.status}`}>
            <dialog id={`sinf-${props.index}`} className="stage-info">
                <div className="dialog-box">
                    <h1 onClick={() => navigator(`/stage/${props.name.toLowerCase().replace(/ /g, "-")}/${props.sectionNames[props.currentSectionProgress || 0].toLowerCase().replace(/ /g, "-") || ""}/1`)}>{`Stage ${props.index} (${props.currentSectionProgress || 0}/${props.totalSections || "NA"})`}</h1>
                    <h3>{props.name}</h3>
                    <p>{props.desc}</p>
                </div>
                <Image constant dir="/" name="hud-scifi-panel.png" alt="stage-info-panel" cls="stage-info-panel"/>
            </dialog>
            <button 
                onClick={async (event) => {
                    event.stopPropagation();
                    closeAllSinfs(document.getElementById(`sinf-${props.index}`));
                    if(document.getElementById(`sinf-${props.index}`).open){
                        document.getElementById(`sinf-${props.index}`).removeAttribute("style");
                        setTimeout(() => document.getElementById(`sinf-${props.index}`).close(), 500);
                    }
                    else{
                        document.getElementById(`sinf-${props.index}`).show();
                        document.getElementById(`sinf-${props.index}`).style.opacity = 1;
                        document.getElementById(`sinf-${props.index}`).style.transform = "translate(-50%, -100%)";
                    }
                }}  
                id={`s-${props.index}`}
            />
        </div>
    )
}

export default function IndexHomepage() {
    const cookies = new Cookies();
    const navigator = useNavigate();
    const location = useLocation();
    const { login } = useGlobal();

    useEffect(() => {
        if(!cookies.get("watchedIntro")){
            cookies.set("watchedIntro", true, { path: "/", maxAge: 7 * 24 * 60 * 60 })
            navigator("/intro?redirectFrom=homepage");
        }
    }, [login.isLoggedIn, cookies.get("watchedIntro")])

    useEffect(scrollableUniverse, [location])

    useEffect(() => {
        let effectTimeout = [];
        if(!localStorage.getItem("bigbanged")){
            localStorage.setItem("bigbanged", true);
            effectTimeout = [
                setTimeout(() => document.getElementById("b-b").classList.add("active"), 1000),
                setTimeout(() => document.getElementById("g-1").classList.add("active"), 5500),
                setTimeout(() => document.getElementById("g-2").classList.add("active"), 6000),
                setTimeout(() => document.getElementById("g-3").classList.add("active"), 6500),
                setTimeout(() => document.getElementById("g-4").classList.add("active"), 7000),
                setTimeout(() => document.getElementById("g-5").classList.add("active"), 7500),
                setTimeout(() => document.getElementById("g-6").classList.add("active"), 8000),
                setTimeout(() => document.getElementById("g-7").classList.add("active"), 8500),
                setTimeout(() => document.getElementById("g-8").classList.add("active"), 9000),
                setTimeout(universalExpand, 10000),
            ];
        }else{
            for(let i = 1; i<9; i++) document.getElementById(`g-${i}`).classList.add("active");
            universalExpand()
        }
        return () => {
            for(const timeout of effectTimeout) clearTimeout(timeout);
        }
    }, []);

    return (
        <>
            <div className="page-container" style={{ backgroundColor: "rgb(20,18,26)" }}>
                <div className="effect-backdrop" onClick={closeAllSinfs}>
                    <div className="star-cluster">
                        <Stars />
                    </div>
                    <div className="big-uobj">
                        <div id="g-1" className="galaxy blueviolet">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <Stage status="current" index={1} name="The Beginning" sectionNames={["Foundation of Programming", "Tools, Languages & Technologies", "Types & Contexts"]} totalSections={3} desc="The beginning of the programming universe."/>
                        </div>
                        <div id="g-2" className="galaxy blueviolet">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <Stage status="inactive" index={2} name="Untitled" desc="Coming soon!"/>
                        </div>
                        <div id="g-3" className="galaxy navy">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <Stage status="inactive" index={3} name="Untitled" desc="Coming soon!"/>
                        </div>
                        <div id="g-4" className="galaxy navy">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <Stage status="inactive" index={4} name="Untitled" desc="Coming soon!"/>
                        </div>
                        <div id="g-5" className="galaxy orangered">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <Stage status="inactive" index={5} name="Untitled" desc="Coming soon!"/>
                        </div>
                        <div id="g-6" className="galaxy orangered">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <Stage status="inactive" index={6} name="Untitled" desc="Coming soon!"/>
                        </div>
                        <div id="g-7" className="galaxy orangered">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <Stage status="inactive" index={7} name="Untitled" desc="Coming soon!"/>
                        </div>
                        <div id="g-8" className="galaxy gold">
                            <div id="l-1"></div>
                            <div id="l-2"></div>
                            <div id="l-3"></div>
                            <Stage status="inactive" index={8} name="Untitled" desc="Coming soon!"/>
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
                <AlertBox id="session-expired" auto detect={(login.isLoggedIn === "undefined" || login.isLoggedIn === false) && (cookies.get("login") === "undefined" || cookies.get("login") === false)} 
                messages={{
                    title: "Your session has expired.",
                    subtitle: "Please sign in again!",
                    action: "Sign out in"
                }} 
                action={() => {
                    navigator("/registration");
                    window.location.reload();
                    signOut(auth);
                }}/>
            </div>
            <SetUp/>
        </>
        
    )
}