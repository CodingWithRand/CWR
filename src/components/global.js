import { useContext, createContext, useState } from "react";

const GlobalState = createContext(undefined);

export function Global({ children }){
  const [loadingState, setLoadingState] = useState('undone');
  return(
    <GlobalState.Provider value={[
      {loadingState, setLoadingState}
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