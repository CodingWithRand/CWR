import { useContext, createContext, useState } from "react";
import { useSearchParams } from "react-router-dom";

const GlobalState = createContext(undefined);

export function Global({ children }){
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "default-os");
  const [searchParams, setSearchParams] = useSearchParams();

  return(
    <GlobalState.Provider value={[
      {searchParams, setSearchParams},
      {theme, setTheme}
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