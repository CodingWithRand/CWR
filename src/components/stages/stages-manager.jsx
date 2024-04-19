import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import FoundationOfProgramming from "./the-beginning/foundation-of-programming";

export default function StagesManager(){
    const { stageName, sectionName } = useParams();
    const [ urlFilteredComponent, setUrlFilteredComponent ] = useState(null);

    useEffect(() => {
        switch(stageName){
            case "the-beginning":
                switch(sectionName){
                    case "foundation-of-programming":
                        setUrlFilteredComponent(<FoundationOfProgramming />);
                        break;
                }
                break;
        }
    }, []);

    return urlFilteredComponent || <></>
}