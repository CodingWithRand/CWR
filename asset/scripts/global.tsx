import { createContext, useState, useEffect, useContext } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

type Mutable<T> = T | null | undefined;

type GlobalStateType = {
  authUser: {
    isAuthUser: Mutable<FirebaseAuthTypes.User>
  },
  counter: {
    globalCounter: Mutable<number>,
    setGlobalCounter: Mutable<React.Dispatch<React.SetStateAction<number | undefined>>>
  }
}

const GlobalStateConstructor = {
  authUser: { isAuthUser: null },
  counter: {
    globalCounter: null,
    setGlobalCounter: null
  }
}

const GlobalState = createContext<GlobalStateType>(GlobalStateConstructor);

export function Global({ children }: { children: JSX.Element }){
  const [isAuthUser, getCurrentUser] = useState<FirebaseAuthTypes.User | null>();
  const [globalCounter, setGlobalCounter] = useState<number>();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => getCurrentUser(user));
    return () => unsubscribe();
  }, []);
  
  return <GlobalState.Provider value={{ authUser: {isAuthUser}, counter: {globalCounter, setGlobalCounter} }}>{children}</GlobalState.Provider>;
}

export function useGlobal(){
  const context = useContext(GlobalState);
  if(!context){
    throw new Error("useGlobal must be used within a Global component!");
  };
  return context;
};