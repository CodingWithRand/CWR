import { useContext, createContext } from "react";
import { useSearchParams } from "react-router-dom";

const GlobalState = createContext(undefined);

export function Global({ children }){
  const [searchParams, setSearchParams] = useSearchParams({loadingState: 'undone'});

  return(
    <GlobalState.Provider value={[
      {searchParams, setSearchParams}
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