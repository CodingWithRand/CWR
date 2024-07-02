import { createContext, useState, useEffect, useContext } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import langs from "../../langs";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Mutable<T> = T | null | undefined;

type GlobalStateType = {
  authUser: {
    isAuthUser: Mutable<FirebaseAuthTypes.User>
  },
  themedColor: {
    bg: string
    comp: string
  },
  lang: {
    lang: keyof typeof langs,
    setLang: Mutable<React.Dispatch<React.SetStateAction<string>>>,
  }
}

const GlobalStateConstructor = {
  authUser: { isAuthUser: null },
  themedColor: {
    bg: Colors.lighter,
    comp: Colors.lighter
  },
  lang: {
    lang: "en" as keyof typeof langs,
    setLang: null
  }
}

const GlobalState = createContext<GlobalStateType>(GlobalStateConstructor);

export function Global({ children }: { children: JSX.Element }){
  const [isAuthUser, getCurrentUser] = useState<FirebaseAuthTypes.User | null>();
  const [themedColor, setThemedColor] = useState({
    bg: Colors.lighter,
    comp: Colors.lighter
  });
  const [lang, setLang] = useState("en")
  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    setThemedColor({
      bg: isDark ? Colors.darker : Colors.lighter,
      comp: isDark ? Colors.lighter : Colors.darker
    })
  }, [isDark])

  useEffect(() => {
    (async () => {
      setLang(await AsyncStorage.getItem("preferredLang") || "en");
    })()
  }, []);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem("preferredLang", lang);
    })()
  }, [lang]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => getCurrentUser(user));
    return () => unsubscribe();
  }, []);
  
  return <GlobalState.Provider value={{ authUser: {isAuthUser}, themedColor: themedColor, lang: { lang, setLang } }}>{children}</GlobalState.Provider>;
}

export function useGlobal(){
  const context = useContext(GlobalState);
  if(!context){
    throw new Error("useGlobal must be used within a Global component!");
  };
  return context;
};