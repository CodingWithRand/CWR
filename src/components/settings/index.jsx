import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGlobal } from "../../scripts/global";
import { SignOut, ThemeChanger } from "../setup";
import { Components, Hooks } from "../../scripts/util";
import { auth, storage } from "../../scripts/firebase";
import { signOut } from "@firebase/auth"
import { getDownloadURL, ref } from "@firebase/storage";
import "../../css/use/settings/index.css";
import "../../css/use/settings/other-settings.css";

import AccountSettings from "./account-settings";
import Cookies from "universal-cookie";


const { Dynamic, AlertBox } = Components;
const { Image } = Dynamic;

function UserProfileImage(){
    const [userProfileIconJSX, setUPIJSX] = useState();

    Hooks.useDelayedEffect(() => {
        if(!auth.currentUser) return;
        if(auth.currentUser?.photoURL) (async () => {
            const userProfileImageRef = ref(storage, `userProfileImage/${auth.currentUser.uid}/profile.png`);
            const imgUrl = await getDownloadURL(userProfileImageRef);
            setUPIJSX(<img alt="user-profile-icon" src={imgUrl} className="user-profile-icon"/>)
        })();
        else setUPIJSX(<Image alt="programmer-profile-icon" dir="icon/" name="programmer.png" cls="user-profile-icon"/>)
    }, [auth.currentUser?.photoURL], 100);

    return <>{userProfileIconJSX}</>
}

function UserProfile(props){
    const { device } = useGlobal();
    const { username } = useParams();

    if(device.device === props.responsiveDevice) switch(device.device){
        case "tablet":
            return <div className="user-profile-pallete tablet">
                <UserProfileImage />
                <div className="user-name theme text-color">{username}</div>
            </div>
        case "pc":
            return <div className="user-profile-pallete pc">
                <UserProfileImage />
                <div className="user-name theme text-color pc">{username}</div>
            </div>
    }  
    else return <></>
}

function SettingMenu(){
    const { device } = useGlobal();

    useEffect(() => {

        function closeSettingTab(e){
            const exceptComponents = [
                e.target === document.querySelector(".setting-categories") || e.target === e.target.closest(".setting-categories"),
                document.querySelector(".setting-categories").contains(e.target),
                document.querySelector(".setup-group").contains(e.target)
            ]
            if(exceptComponents.some(v => v === true)) return;
            document.querySelector(".setting-categories").style.transform = "translateX(-100%)" ;
        };

        switch(device.device){
            case "tablet":
                document.querySelector(".setting-categories").style.transform = "translateX(-100%)";
                document.querySelector(".page-container").addEventListener("click", closeSettingTab);
                break;
            case "pc":
                document.querySelector(".setting-categories").style.transform = "translateX(0px)";
                document.querySelector(".page-container").removeEventListener("click", closeSettingTab);
                break;
        }        

        return () => document.querySelector(".page-container")?.removeEventListener("click", closeSettingTab);
    }, [device.device]);

    if(device.device === "tablet") return <button className="menu-btn theme border-color" onClick={() => document.querySelector(".setting-categories").style.transform = "translateX(0px)"}><Image alt="menu-icon" dir="icon/" name="menu.png" cls="menu-icon" /></button>;
    else return 
};

function SettingContent(){
    const [searchParams, setSearchParams] = useSearchParams();

    switch(searchParams.get("setting")){
        case "account-settings": return <AccountSettings />
        default: return <div className="theme text-color">Unknown setting category</div>
    }  
}

export default function SettingsPage(){
    const cookies = new Cookies();
    const { exceptionPage, login } = useGlobal();
    const { username } = useParams();
    const [selectingSettingCategory, setSSC] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();
    const navigator = useNavigate();
    
    useEffect(() => {
        if(!auth.currentUser) return;
        if(auth.currentUser?.displayName !== username) navigator("no-permission");
    }, [auth.currentUser])
    
    useEffect(() => exceptionPage.setOnExceptionPage(true), []);

    useEffect(() => {
        document.querySelectorAll(".category").forEach((settingCategory) => {
            if(settingCategory.id === selectingSettingCategory){
                settingCategory.classList.remove("hovered");
                settingCategory.setAttribute("binding-status", true);
                settingCategory.style.color = "red";
            }
            else{
                settingCategory.classList.add("hovered");
                settingCategory.setAttribute("binding-status", false);
                settingCategory.style.color = "";
            };
        });
    }, [selectingSettingCategory]);

    function SSC(sc){
        setSSC(sc);
        setSearchParams((params) => {
            params.set("setting", sc);
            return params;
        });
    }

    return(
        <div className="page-container font-barlow">
            <div className="setting-nav theme container bg-color intense">
                <SettingMenu />
                <UserProfile responsiveDevice="pc" />
                <div className="setup-group">
                    <ThemeChanger noTitle />
                    <SignOut noTitle />
                </div>
            </div>
            <div className="setting-page">
                <div className="setting-categories">
                    <UserProfile responsiveDevice="tablet" />
                    <div id="page-appearance" className="category theme text-color" onClick={() => SSC("page-appearance")}>
                        <Image binded to="page-appearance" alt="page-appearance-icon" dir="icon/" name="page-appearance.png" cls="setting-icon"/>
                        Appearance
                    </div>
                    <div id="others" className="category theme text-color" onClick={() => SSC("others")}>
                        <Image binded to="others" alt="othesr-icon" dir="icon/" name="dots.png" cls="setting-icon" />
                        Others
                    </div>
                    <div id="account-settings" className="category theme text-color" onClick={() => SSC("account-settings")}>
                        <Image binded to="account-settings" alt="account-settings-icon" dir="icon/" name="account.png" cls="setting-icon" />
                        Account Settings
                    </div>
                </div>
                <div className="setting-content">
                    <SettingContent />
                </div>
            </div>
            <a className="return-ref" href="/">Return to home page</a>
            <AlertBox id="session-expired" auto detect={(login.isLoggedIn === "undefined" || login.isLoggedIn === false) && (cookies.get("login") === "undefined" || cookies.get("login") === false)} 
            messages={{
                title: "Your session has expired.",
                subtitle: "Please sign in again!",
                action: "Sign out in"
            }} 
            action={() => {
                navigator("/registration");
                signOut(auth);
            }}/>
        </div>
    );
}