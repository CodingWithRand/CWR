import { Global, useGlobal } from "./components/global";
import LoadingScreen from "./components/intro";
import SetUp from './components/setup';

function PageAnalysis() {
  const [{loadingState}] = useGlobal();
  if(loadingState === 'undone' || loadingState === 'done') return <LoadingScreen />
  else if(loadingState === 'proceeded') return <></>
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
    </Global>
  )
}

export default App;
