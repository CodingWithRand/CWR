import { Global } from "./scripts/global";
import { Routes, Outlet, Route, useLocation} from "react-router-dom";
import IndexHomepage from "./components/index";
import LoadingScreen from "./components/intro";
import { SetUp } from './components/setup';
import { useEffect } from "react";
import RegistrationPage from "./components/registration-page/index";
import EmailVerifificationPage from "./components/registration-page/email-verification";
import SettingsPage from "./components/settings/index";
import { NoPermission, NotFound } from "./components/page-error";
import './css/use/responsive.css';
import './css/use/theme.css';
import Greet from "./components/greeting";

function PageRouter() {

  const location = useLocation();

  useEffect(() => window.scrollTo(0, document.body.scrollHeight), [])

  useEffect(() => {
    const path = location.pathname;
    let title;

    switch(path){
      case "/": title = "Home Page"; break;
      case "/greeting": title = "Waiting for client to back online..."; break;
      case "/registration": title = "Registration Page"; break;
      case "/intro": title = "Introduction"; break;
      default: title = "404 Not found"; break;
    };

    if(title === "404 Not found"){
      if(path.match(/^\/users\/(.+)/)) title = "User's Dashboard";
      else title = "404 Not found";
    }

    document.title = title;

  }, [location])

  useEffect(() => {
    const path = location.pathname;
    if(path === "/greeting" && !document.hidden) document.title = "Greeting Traveler...";
  }, [location, document.hidden])

  return (
    <Routes>
      <Route index path="/" element={<IndexHomepage />} />
      <Route index path="/homepage" element={<IndexHomepage />} />
      <Route exact path="/greeting" element={<Greet />} />
      <Route exact path="/intro" element={<LoadingScreen />} />
      <Route exact path="/registration" element={<RegistrationPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <Global>
      <PageRouter />
      <SetUp/>
      {/*
        Image icon special thanks to...
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
