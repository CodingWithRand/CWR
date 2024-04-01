import { useContext, createContext, useState, useEffect } from "react";
import Neutral from "@/geutral/util";

const LoadingState = createContext(undefined);

export default function Loading({ children, cover, loadingPage }){
    const [ loadingState, setLoadingState ] = useState(false);
    const [ showingComponent, setShowingComponent ] = useState(children);

    useEffect(() => {
        if(cover && loadingState) setShowingComponent(<>
            {loadingPage || <Neutral.Components.LoadingPage transparentBg />}
            {children}
        </>);
        else if(!cover && loadingState) setShowingComponent(<Neutral.Components.LoadingPage transparentBg />)
        else if(!loadingState) setShowingComponent(children)
    }, [loadingState])

    return(
        <LoadingState.Provider value={setLoadingState}>
           {showingComponent}
        </LoadingState.Provider>
    )
}

export function useLoadingState(){
    const context = useContext(LoadingState);
    if(!context){
      throw new Error("useLoadingState must be used within a Loading component!");
    };
    return context;
};