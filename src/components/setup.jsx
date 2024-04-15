import { useEffect, useState } from 'react';
import '../css/use/setup.css';
import { Components, Hooks } from '../scripts/util';
import { useGlobal } from '../scripts/global';
import { signOut } from '@firebase/auth';
import { auth } from '../scripts/firebase';
import { useNavigate } from 'react-router-dom';

const { Dynamic } = Components;
const { Image } = Dynamic;

function onHoverSetupBtn(btnId){
    try{
        if(document.querySelector(`#${btnId} > .setup-desc`).style.opacity === "0" || document.querySelector(`#${btnId} > .setup-desc`).style.opacity === "") document.querySelector(`#${btnId} > .setup-desc`).style.opacity = 1;
        else document.querySelector(`#${btnId} > .setup-desc`).style.opacity = 0;
    }catch(error){console.error(error)}
}

function OptionTitle(props){
    if(props.noTitle) return <></>
    else return <div className='setup-desc' style={props.style}>{props.children}</div>
}

function ThemeChanger(props){
    const { theme } = useGlobal();

    useEffect(() => {
        switch(theme.theme){
            case 'light':
                document.documentElement.classList.remove("dark");
                break;
            case 'dark':
                document.documentElement.classList.add("dark");
                break;
            case 'default-os':
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if(isDark) document.documentElement.classList.add("dark");
                else document.documentElement.classList.remove("dark");
                break;
        }
    }, [theme.theme])

    useEffect(() => localStorage.setItem("theme", theme.theme), [theme.theme])

    function changeTheme(){
        switch(theme.theme){
            case 'light':
                theme.setTheme('dark');
                break;
            case 'dark':
                theme.setTheme('default-os');
                break;
            case 'default-os':
                theme.setTheme('light');
                break;
        };
    };
    
    return (
        <button id='theme' className='setup-btn' 
            onClick={changeTheme} 
            onMouseEnter={() => { if(!props.noTitle) onHoverSetupBtn("theme") }} 
            onMouseLeave={() => { if(!props.noTitle) onHoverSetupBtn("theme") }}
        >
            <Image dir="icon/" name="mode.png" alt='theme-changer-btn-icon' cls="setup-btn-icon-shadow theme custom" />
            <OptionTitle noTitle={props.noTitle}>Theme</OptionTitle>
        </button>
    )
}

function SignOut(props){
    const navigator = useNavigate();

    return (
        <button id='signout' className='setup-btn' onClick={async () => {
            const registryDataResponse = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
            });
            const registryData = await registryDataResponse.json();
            await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, writeData: {...registryData.docData, [window.location.origin]: { authenticated: false, token: null, at: null } }, adminKey: process.env.REACT_APP_FIREBASE_PERSONAL_ADMIN_KEY })
            });
            signOut(auth);
            navigator("/registration");
            // window.location.reload();
        }}
            onMouseEnter={() => onHoverSetupBtn("signout")} 
            onMouseLeave={() => onHoverSetupBtn("signout")}
        >
            <Image constant dir="icon/" name="exit.png" alt="signout-btn-icon" cls="setup-btn-icon-shadow theme custom" />
            <OptionTitle noTitle={props.noTitle} style={{width: `${props.parentSize / props.childNumber}px`}}>Sign Out</OptionTitle>
        </button>
    )
}

function BgMusicController(props){
    const [ videoState, setVideoState ] = useState("unmuted");
    Hooks.useDelayedEffect(() => {
        const player = document.getElementById('youtubePlayer');
        if(videoState === "unmuted"){
            player.contentWindow.postMessage(JSON.stringify({"event":"command","func":"playVideo","args":""}), "*");
            player.contentWindow.postMessage(JSON.stringify({"event":"command","func":"unMute","args":""}), "*");
        }
        else player.contentWindow.postMessage(JSON.stringify({"event":"command","func":"mute","args":""}), "*");
    }, [videoState], 1000);
    useEffect(() => {
        if(!localStorage.getItem("bgm")) localStorage.setItem("bgm", "unmuted");
        setVideoState(localStorage.getItem("bgm"));
    }, [])
    return (
        <button id="bgm-controller" className='setup-btn' onClick={() => { setVideoState(videoState === "unmuted" ? "muted" : "unmuted"); localStorage.setItem("bgm", videoState === "unmuted" ? "muted" : "unmuted") }}
            onMouseEnter={() => { if(!props.noTitle) onHoverSetupBtn("bgm-controller") }} 
            onMouseLeave={() => { if(!props.noTitle) onHoverSetupBtn("bgm-controller") }}
        >
            <Image constant={!props.theme} dir="icon/" name={videoState === "unmuted" ? "audio.png" : "muted.png"} alt="bg-music-controller-btn-icon" cls="setup-btn-icon-shadow theme custom"/>
            <OptionTitle noTitle={props.noTitle}>{`Music: ${videoState}`}</OptionTitle>
        </button>
    )
}

function MoreSettings(props){
    const navigator = useNavigate();

    return (
        <button id='more' className='setup-btn' onClick={() => {navigator(`account/settings`);}}
            onMouseEnter={() => onHoverSetupBtn("more")} 
            onMouseLeave={() => onHoverSetupBtn("more")}
        >
            <Image constant dir="icon/" name="dots.png" alt="more-settings-btn-icon" cls="setup-btn-icon-shadow theme custom" />
            <div className='setup-desc theme text-color' style={{width: `${props.parentSize / props.childNumber}px`}}>More</div>
        </button>
    )
}

function ToolKit(){
    const { authUser } = useGlobal();
    const [isAnimating, animate] = useState({
        setting: '',
        tkSize: 0
    });
    const setting_btn_number = 2;

    if(authUser.isAuthUser && auth.currentUser?.emailVerified) return(
        <>
            <button id='settings' className='setup-btn' 
                onMouseEnter={() => onHoverSetupBtn("settings")} 
                onMouseLeave={() => onHoverSetupBtn("settings")} 
                onClick={() => animate(prevState => ({tkSize: prevState.tkSize === setting_btn_number * 35 ? 0 : setting_btn_number * 35 , setting: prevState.setting === "animate" ? '' : "animate"}))}
            >
                <Image constant dir="icon/" name="setting.png" alt="setting-btn-icon" cls={`setup-btn-icon-shadow theme custom setting ${isAnimating.setting}`} />
                <div className='setup-desc'>Settings</div>
            </button>
            <div className='tool-kit' style={{width: `${isAnimating.tkSize}px`}}>
                <SignOut parentSize={isAnimating.tkSize} childNumber={setting_btn_number}/>
                <MoreSettings parentSize={isAnimating.tkSize} childNumber={setting_btn_number}/>
            </div>
        </>
    )
}

export { ThemeChanger, SignOut, BgMusicController }

export function SetUp(){
    return (
        <div className='setup'>
            <ThemeChanger />
            <BgMusicController />
            <ToolKit />
        </div>
    );
};