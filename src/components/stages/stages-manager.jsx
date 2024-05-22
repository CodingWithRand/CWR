import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Components } from "../../scripts/util";
import { useGlobal } from "../../scripts/global";
import FoundationOfProgramming from "./the-beginning/foundation-of-programming";
import { SetUp } from "../setup";
import "../../css/use/stages.css";

const totalStageSections = {
    "the-beginning": 2
}

export default function StagesManager(){
    const { stageName, sectionName, page } = useParams();
    const { scriptLoaded } = useGlobal();
    const [ urlFilteredComponent, setUrlFilteredComponent ] = useState(null);
    const [ bgimg, setbgimg ] = useState("");
    const [ bgfilter, setbgfilter ] = useState(undefined);
    const navigator = useNavigate();

    useEffect(() => {
        switch(stageName){
            case "the-beginning":
                switch(sectionName){
                    case "foundation-of-programming":
                        setbgfilter("hue-rotate(315deg)")
                        setUrlFilteredComponent(<FoundationOfProgramming />);
                        break;
                }
                break;
        }
    }, []);

    useEffect(() => {
        if(!scriptLoaded.scriptLoaded && page === "0"){
            setbgimg("url(/imgs/backend-images/spaceship-cockpit.png)")
            setTimeout(() => document.querySelector("#animation-controller").click(), 2000);
            setTimeout(() => {
                setbgimg(`url("/imgs/backend-images/${stageName}-stage-background.png")`);
                document.querySelector("main").remove();
                navigator(`/stage/${stageName}/${sectionName}/1`);
            }, 5000);
        }else if(scriptLoaded.scriptLoaded && page === "0"){
            navigator(`/stage/${stageName}/${sectionName}/1`);
            setbgimg(`url("/imgs/backend-images/${stageName}-stage-background.png")`);
        }else{
            setbgimg(`url("/imgs/backend-images/${stageName}-stage-background.png")`);
        }
    }, [])

    return(
        <>
            <div className="page-container" style={{ 
                position: "absolute",
                backgroundImage: bgimg,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: bgfilter,
                overflow: "hidden"
            }}>
                <SetUp/>
                {page === "0" ? <Components.HyperspaceTeleportationBackground /> : <div className="page-container stage-content"><div className="page-container" style={{ overflow: "auto" }}>{urlFilteredComponent}</div></div>}
                {page === "0" ? <></> : <footer className="page-controlling-panel">
                    <button onClick={() => parseInt(page) - 1 === 0 ? navigator("/") : navigator(`/stage/the-beginning/foundation-of-programming/${parseInt(page) - 1}`)}>
                        <Components.Dynamic.Image constant dir="icon/" name="prev.png" alt="prev-arrow-icon" />
                    </button>
                    <span className="page-number font-league-spartan">{page}</span>
                    <button disabled={parseInt(page) === totalStageSections[stageName]} style={{ opacity: parseInt(page) === totalStageSections[stageName] ? 0.5 : 1 }} onClick={() => navigator(`/stage/the-beginning/foundation-of-programming/${parseInt(page) + 1}`)}>
                        <Components.Dynamic.Image constant dir="icon/" name="next.png" alt="next-arrow-icon" />
                    </button>
                </footer>} 
            </div>
        </>
    )
}