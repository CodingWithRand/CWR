import { createContext, useState, useEffect, useContext } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

const GlobalState = createContext<{ authUser: { isAuthUser: FirebaseAuthTypes.User | null | undefined } }>({ authUser: { isAuthUser: null } });

export function Global({ children }: { children: JSX.Element }){
  const [isAuthUser, getCurrentUser] = useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => getCurrentUser(user));
    return () => unsubscribe();
  }, []);
  
  return <GlobalState.Provider value={{ authUser: {isAuthUser} }}>{children}</GlobalState.Provider>;
}

export function useGlobal(){
  const context = useContext(GlobalState);
  if(!context){
    throw new Error("useGlobal must be used within a Global component!");
  };
  return context;
};