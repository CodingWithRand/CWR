import { Global } from "./scripts/global";
import { Routes, Outlet, Route, useLocation} from "react-router-dom";
import IndexHomepage from "./components/index";
import LoadingScreen from "./components/intro";
import { useEffect } from "react";
import RegistrationPage from "./components/registration-page";
import { NotFound } from "./components/page-error";
import './css/use/responsive.css';
import './css/use/theme.css';
import Greet from "./components/greeting";
import AccountSettings from "./components/account-settings";
import StagesManager from "./components/stages/stages-manager";

function PageRouter() {

  const location = useLocation();

  useEffect(() => window.scrollTo(0, document.body.scrollHeight), [])

  useEffect(() => {
    const path = location.pathname;
    let title;

    switch(path){
      case "/": title = "Home Page"; break;
      case "/homepage": title = "Home Page"; break;
      case "/greeting": title = "Greeting Traveler..."; break;
      case "/registration": title = "Registration Page"; break;
      case "/intro": title = "Introduction"; break;
      case "/account/settings": title = "Account Settings"; break;
      default: title = "404 Not found"; break;
    };

    document.title = title;

  }, [location])

  return (
    <Routes>
      <Route index path="/" element={<IndexHomepage />} />
      <Route index path="/homepage" element={<IndexHomepage />} />
      <Route exact path="/greeting" element={<Greet />} />
      <Route exact path="/intro" element={<LoadingScreen />} />
      <Route exact path="/registration" element={<RegistrationPage />} />
      <Route exact path="/account/settings" element={<AccountSettings />}/>
      <Route exact path="/stage/:stageName/:sectionName/:page" element={<StagesManager />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <Global>
      <PageRouter />
      {/*
        Image icon special thanks to...
        <a href="https://www.pikpng.com/pngvi/hRbRmh_spaceship-cockpit-png-pc-game-clipart/" target="_blank">Spaceship Cockpit Png - Pc Game Clipart @pikpng.com</a>
        <a href="https://www.vecteezy.com/free-png/futuristic-hud">Futuristic Hud PNGs by Vecteezy</a>
        <a href="https://www.flaticon.com/free-icons/dark" title="dark icons">Dark icons created by rizky adhitya pradana - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/weather" title="weather icons">Weather icons created by Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/desktop" title="desktop icons">Desktop icons created by Pixel perfect - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/logout" title="logout icons">Logout icons created by Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/setting" title="setting icons">Setting icons created by Phoenix Group - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/dots" title="dots icons">Dots icons created by Ayub Irawan - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/mute" title="mute icons">Mute icons created by Pixel perfect - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/speaker" title="speaker icons">Speaker icons created by Freepik - Flaticon</a>
      */}
      <Outlet/>
    </Global>
  )
}

export default App;
