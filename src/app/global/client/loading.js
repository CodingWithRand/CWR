import { useContext, createContext, useState, useEffect } from "react";
import Neutral from "@/geutral/util";

const LoadingState = createContext(undefined);

export default function Loading({ children, cover, loadingPage }){
    const [ loadingState, setLoadingState ] = useState(false);

    useEffect(() => {
        if(loadingState) document.querySelector("#page-parent > main").style.display = "none";
        else document.querySelector("#page-parent > main").removeAttribute("style");
    }, [loadingState])

    return(
        <LoadingState.Provider value={setLoadingState}>
            <div id="page-parent">
                {
                    cover && loadingState ? loadingPage || <Neutral.Components.LoadingPage transparentBg /> :
                    !cover && loadingState ? <Neutral.Components.LoadingPage transparentBg /> : <></>
                }
                {children}
            </div>
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