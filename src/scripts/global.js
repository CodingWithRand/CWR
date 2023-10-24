import { onAuthStateChanged } from "firebase/auth";
import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import Cookies from "universal-cookie";

const GlobalState = createContext(undefined);

export function Global({ children }){
  const cookies = new Cookies();
  const [isAuthUser, getCurrentUser] = useState();

  onAuthStateChanged(auth, (user) => getCurrentUser(user));
  
  const [isLoggedIn, logIn] = useState(!cookies.get("login") ? false : cookies.get("login"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "default-os");

  useEffect(() => {

    if(cookies.get("login") === false && !isAuthUser) logIn(false);
    else if(isAuthUser || cookies.get("login") === true){
      logIn(true);
      return () => console.log('Falsy detect');
    }

  }, [cookies.get("login"), isAuthUser]);

  useEffect(() => {
    if(cookies.get("login") === "undefined") cookies.set("login", "undefined", { path: "/", maxAge: 60 });
    else cookies.set("login", isLoggedIn, { path: "/", maxAge: 60 });
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