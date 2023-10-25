import { useEffect } from 'react';
import '../css/use/setup.css';
import {  Components } from '../scripts/util';
import { useGlobal } from '../scripts/global';

export default function SetUp(){
    const [{theme, setTheme}] = useGlobal();

    useEffect(() => {
        switch(theme){
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
    }, [theme])

    useEffect(() => localStorage.setItem("theme", theme), [theme])

    function changeTheme(){
        switch(theme){
            case 'light':
                setTheme('dark');
                break;
            case 'dark':
                setTheme('default-os');
                break;
            case 'default-os':
                setTheme('light');
                break;
        };
    };

    return (
        <div className='setup'>
            <button className='theme-changer' onClick={changeTheme}>
                <Components.DynamicImage dir="icon/" name="mode.png" alt='theme-changer-btn-icon' cls="tc-icon theme custom" />
            </button>
        </div>
    );
};