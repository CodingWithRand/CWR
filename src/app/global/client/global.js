"use client"

import { onAuthStateChanged } from "@firebase/auth";
import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import Cookies from "universal-cookie";

const GlobalState = createContext(undefined);

export function Global({ children }){
  const cookies = new Cookies();
  const [isAuthUser, getCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => getCurrentUser(user));
    return () => unsubscribe();
  }, []);
  
  const [isLoggedIn, logIn] = useState(false);
  const [theme, setTheme] = useState("default-os");
  const [onExceptionPage, setOnExceptionPage] = useState(false);
  const [device, detectDevice] = useState("pc");

  useEffect(() => {
    if(!isAuthUser) logIn(false);
    else {
      logIn(true);
      return () => console.log('Falsy detect');
    }
  }, [cookies.get("login"), isAuthUser]);

  useEffect(() => {
    function detectingDevice(){
      if(window.innerWidth < 640) detectDevice("tablet")
      else detectDevice("pc");
    };

    detectingDevice();
    
    window.addEventListener("resize", detectingDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, []);

  useEffect(() => {
    if(localStorage.getItem("theme") === null) localStorage.setItem("theme", theme)
    setTheme(localStorage.getItem("theme"))
  }, [])

  useEffect(() => {
    if(cookies.get("login") === undefined) cookies.set("login", "undefined");
    else cookies.set("login", isLoggedIn);
  }, [isLoggedIn])

  return(
    <GlobalState.Provider value={{
      theme: {theme, setTheme},
      login: {isLoggedIn, logIn},
      authUser: {isAuthUser},
      exceptionPage: {onExceptionPage, setOnExceptionPage},
      device: {device, detectDevice}
    }}>
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