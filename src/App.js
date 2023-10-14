import { Global, useGlobal } from "./components/global";
import { Routes, Outlet, useNavigate, Route } from "react-router-dom";
import LoadingScreen from "./components/intro";
import SetUp from './components/setup';
import Registry from "./components/registry";
import functions from "./scripts/functions";

function PageAnalysis() {
  const navigator = useNavigate();
  const [{searchParams}] = useGlobal();
  const loadingState = searchParams.get('loadingState');
  if(loadingState === 'proceeded'){
    functions.sync_delay(1000)
    navigator('/regristation')
  }
  return (
    <Routes>
      <Route path="/" element={<LoadingScreen />} />
      <Route path="/regristation" element={<Registry />} />
    </Routes>
  )
}

function App() {
  return (
    <Global>
      <PageAnalysis />
      <SetUp/>
      {/*
        Image icon special thanks to...
        <a href="https://www.flaticon.com/free-icons/dark" title="dark icons">Dark icons created by rizky adhitya pradana - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/weather" title="weather icons">Weather icons created by Freepik - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/desktop" title="desktop icons">Desktop icons created by Pixel perfect - Flaticon</a>
      */}
      <Outlet/>
    </Global>
  )
}

export default App;
