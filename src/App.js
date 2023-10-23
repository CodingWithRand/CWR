import { Global } from "./scripts/global";
import { Routes, Outlet, Route} from "react-router-dom";
import IndexHomepage from "./components/index";
import LoadingScreen from "./components/intro";
import SetUp from './components/setup';
import RegistrationPage from "./components/registration-page/index";
import EmailVerifificationPage from "./components/registration-page/email-verification";
import './css/use/responsive.css';
import './css/use/theme.css';

function PageRouter() {
  return (
    <Routes>
      <Route index path="/" element={<IndexHomepage />} />
      <Route exact path="/intro" element={<LoadingScreen />} />
      <Route exact path="/registration" element={<RegistrationPage />} />
      <Route exact path="/registration/verify" element={<EmailVerifificationPage />}/>
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
        <a href="https://www.flaticon.com/free-icons/mail" title="mail icons">Mail icons created by Freepik - Flaticon</a>
      */}
      <Outlet/>
    </Global>
  )
}

export default App;
