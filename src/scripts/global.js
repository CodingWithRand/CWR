import { signOut } from "firebase/auth";
import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import Cookies from "universal-cookie";

const GlobalState = createContext(undefined);

export function Global({ children }){
  const cookies = new Cookies();
  const [isLoggedIn, logIn] = useState(!cookies.get("login") ? false : cookies.get("login"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "default-os");

  useEffect(() => {
    const intervalId = setInterval(() => {
      if(!cookies.get("login")) logIn(false);
    }, 1000);

    return () => clearInterval(intervalId);

  }, []);

  useEffect(() => {
    cookies.set("login", isLoggedIn, { path: "/", maxAge: 60 });
  }, [isLoggedIn]);

  useEffect(() => {
    if(!isLoggedIn) signOut(auth).then(() => console.log(auth.currentUser));
  }, [isLoggedIn]);

  return(
    <GlobalState.Provider value={[
      {theme, setTheme},
      {isLoggedIn, logIn}
    ]}>
      {children}
    </GlobalState.Provider>
  );
};

export function useGlobal(){
  const context = useContext(GlobalState);
  if(!context){
    throw new Error("useGlobal must be used within a Global component!");
  };
  return context;
};