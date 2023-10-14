import { useEffect, useState } from 'react';
import '../css/use/setup.css';
import functions from '../scripts/functions';

export default function SetUp(){
    const [theme, setTheme] = useState("light")
    const [themeBtnIcon, setThemeBtnIcon] = useState(functions.retrieve_image("light-mode.png", true))

    useEffect(() => {
        switch(theme){
            case 'light':
                setThemeBtnIcon(functions.retrieve_image("light-mode.png", true));
                document.documentElement.classList.remove("dark");
                break;
            case 'dark':
                setThemeBtnIcon(functions.retrieve_image("dark-mode.png", true));
                document.documentElement.classList.add("dark");
                break;
            case 'default-os':
                setThemeBtnIcon(functions.retrieve_image("default-mode.png", true));
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if(isDark) document.documentElement.classList.add("dark");
                else document.documentElement.classList.remove("dark");
                break;
        }
    }, [theme])

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
                <img className='tc-icon theme custom' src={themeBtnIcon} alt='theme-changer-btn-icon'/>
            </button>
        </div>
    );
};