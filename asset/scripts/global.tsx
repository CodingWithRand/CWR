import { createContext, useState, useEffect, useContext } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

type Mutable<T> = T | null | undefined;

type GlobalStateType = {
  authUser: {
    isAuthUser: Mutable<FirebaseAuthTypes.User>
  },
  counter: {
    globalCounter: Mutable<number>,
    setGlobalCounter: Mutable<React.Dispatch<React.SetStateAction<number | undefined>>>
  }
  themedColor: {
    bg: string
    comp: string
  }
}

const GlobalStateConstructor = {
  authUser: { isAuthUser: null },
  counter: {
    globalCounter: null,
    setGlobalCounter: null
  },
  themedColor: {
    bg: Colors.lighter,
    comp: Colors.lighter
  }
}

const GlobalState = createContext<GlobalStateType>(GlobalStateConstructor);

export function Global({ children }: { children: JSX.Element }){
  const [isAuthUser, getCurrentUser] = useState<FirebaseAuthTypes.User | null>();
  const [globalCounter, setGlobalCounter] = useState<number>();
  const [themedColor, setThemedColor] = useState({
    bg: Colors.lighter,
    comp: Colors.lighter
  });
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    console.log(isDark)
    setThemedColor({
      bg: isDark ? Colors.darker : Colors.lighter,
      comp: isDark ? Colors.lighter : Colors.darker
    })
  }, [isDark])

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => getCurrentUser(user));
    return () => unsubscribe();
  }, []);
  
  return <GlobalState.Provider value={{ authUser: {isAuthUser}, counter: {globalCounter, setGlobalCounter}, themedColor: themedColor }}>{children}</GlobalState.Provider>;
}

export function useGlobal(){
  const context = useContext(GlobalState);
  if(!context){
    throw new Error("useGlobal must be used within a Global component!");
  };
  return context;
};