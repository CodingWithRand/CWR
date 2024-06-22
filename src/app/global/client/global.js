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
      if(window.innerWidth < 640) detectDevice("xs")
      else if(window.innerWidth < 768) detectDevice("sm")
      else if(window.innerWidth < 1024) detectDevice("md")
      else if(window.innerWidth < 1280) detectDevice("lg")
      else if(window.innerWidth < 1536) detectDevice("xl")
      else detectDevice("2xl");
    };

    detectingDevice();
    
    window.addEventListener("resize", detectingDevice);
    return () => window.removeEventListener("resize", detectDevice);
  }, []);

  useEffect(() => {
    if(localStorage.getItem("theme") === null) localStorage.setItem("theme", theme)
    setTheme(localStorage.getItem("theme"))
  }, [])

  useEffect(() => localStorage.setItem("theme", theme), [theme])

  useEffect(() => {
    if(cookies.get("emailVerified") === undefined) cookies.set("emailVerified", false);
    else if(isAuthUser) cookies.set("emailVerified", isAuthUser.emailVerified);
    else cookies.set("emailVerified", false);
    if(cookies.get("username") === undefined) cookies.set("username", null);
    else if(isAuthUser) cookies.set("username", isAuthUser.displayName);
    else cookies.set("username", null);
  }, [isAuthUser])

  useEffect(() => {
    if(cookies.get("login") === undefined) cookies.set("login", null);
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