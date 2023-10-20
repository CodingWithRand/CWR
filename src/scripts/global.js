import { useContext, createContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from 'universal-cookie';

const GlobalState = createContext(undefined);

export function Global({ children }){
  const currentTheme = new Cookies();
  const [theme, setTheme] = useState(currentTheme.get("theme") || "default-os");
  const [searchParams, setSearchParams] = useSearchParams({loadingState: 'undone'});

  return(
    <GlobalState.Provider value={[
      {searchParams, setSearchParams},
      {theme, setTheme, currentTheme}
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