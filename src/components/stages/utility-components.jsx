import { useEffect } from "react"
import { useParams } from "react-router-dom";
import { Components } from "../../scripts/util";

export function Quote({ quote, author, initialAnimationTime }){
    const { page } = useParams();

    useEffect(() => {
        let timeoutIds = [];
        if(page){
            document.querySelectorAll(".stage-paragraph.quotation .quote").forEach((q) => timeoutIds.push(setTimeout(() => q.style.opacity = 1, initialAnimationTime)));
            timeoutIds.push(setTimeout(() => document.querySelector(".stage-paragraph.quotation .quote-scrollable-container").style.transform = "translateY(0)", initialAnimationTime + 1000));
            timeoutIds.push(setTimeout(() => document.querySelector("cite.citation").style.opacity = 1, initialAnimationTime + 2000));
        }else{
            timeoutIds.forEach((t) => clearTimeout(t));
        }
        return () => timeoutIds.forEach((t) => clearTimeout(t));
    }, [page]);

    return (
        <>
            <div className="stage-paragraph quotation responsive font-oswald">
                <span className="quote responsive">“</span>
                <div className="quote-fixed-container">
                    <div className="quote-scrollable-container">
                        <blockquote>{quote}</blockquote>
                    </div>
                </div>
                <span className="quote responsive close">”</span>
            </div>
            <cite className="citation font-oswald"><i>{author}</i></cite>
        </>
    )
}

export function ComputerComponent(props){
    return (
        <div className={`computer-component bg ${props.bgColor}`}>
            <h1 className="responsive">{props.title}</h1>
            <ul>
                {(() => {
                    let body = [];
                    for(let i = 0; i < props.elementNumber; i++){
                        body.push(
                            <li className="responsive" key={i}>
                                <Components.Dynamic.Image name={`${props.componentNames[i].toLowerCase()}.png`} alt={props.componentNames[i]} constant dir="icon/" width={100} height={100}/>
                                <div className="computer-info-card">
                                    <h2 className="font-league-spartan responsive">{props.componentNames[i]}</h2>
                                    <p className="font-oswald">{props.componentDescriptions[i]}</p>
                                </div>
                            </li>
                        )
                    }
                    return body
                })()}
            </ul>
        </div>
    );
}