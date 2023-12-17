import { useEffect, useState } from 'react';
import '../css/use/setup.css';
import { Components } from '../scripts/util';
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
    else return <div className='setup-desc theme text-color' style={props.style}>{props.children}</div>
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
        <button id='signout' className='setup-btn' onClick={() => {signOut(auth); navigator("/registration"); window.location.reload();}}
            onMouseEnter={() => onHoverSetupBtn("signout")} 
            onMouseLeave={() => onHoverSetupBtn("signout")}
        >
            <Image dir="icon/" name="exit.png" alt="signout-btn-icon" cls="setup-btn-icon-shadow theme custom" />
            <OptionTitle noTitle={props.noTitle} className='setup-desc theme text-color' style={{width: `${props.parentSize / props.childNumber}px`}}>Sign Out</OptionTitle>
        </button>
    )
}

function MoreSettings(props){
    const { authUser } = useGlobal();
    const navigator = useNavigate();

    return (
        <button id='more' className='setup-btn' onClick={() => {navigator(`users/${authUser.isAuthUser.displayName}/settings`);}}
            onMouseEnter={() => onHoverSetupBtn("more")} 
            onMouseLeave={() => onHoverSetupBtn("more")}
        >
            <Image dir="icon/" name="dots.png" alt="more-settings-btn-icon" cls="setup-btn-icon-shadow theme custom" />
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
                <Image dir="icon/" name="setting.png" alt="setting-btn-icon" cls={`setup-btn-icon-shadow theme custom setting ${isAnimating.setting}`} />
                <div className='setup-desc theme text-color'>Settings</div>
            </button>
            <div className='tool-kit' style={{width: `${isAnimating.tkSize}px`}}>
                <SignOut parentSize={isAnimating.tkSize} childNumber={setting_btn_number}/>
                <MoreSettings parentSize={isAnimating.tkSize} childNumber={setting_btn_number}/>
            </div>
        </>
    )
}

export { ThemeChanger, SignOut }

export function SetUp(){
    const { exceptionPage } = useGlobal();
    if(exceptionPage.onExceptionPage) return <></>;
    return (
        <div className='setup'>
            <ThemeChanger />
            <ToolKit />
        </div>
    );
};