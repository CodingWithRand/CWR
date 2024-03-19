import { useGlobal } from "@/app/global/client/global";
import { originContent, interestContent, learningStyle } from "./articleContents/paragraphs";
import { useEffect } from "react";
import OriginBioCard from "./articleContents/media/origin-bio-card";
import Client from "@/app/global/client/util";
import ProgrammingInterest from "./articleContents/media/programming-interest";
import LearningStyle from "./articleContents/media/learning-style";

function ArticleMedia({ id }){
    switch(id){
        case "origin": return <OriginBioCard />
        case "interest": return <ProgrammingInterest />
        case "learning-style": return <LearningStyle />
    }
}

export function Article({ id, index }) {
    const { device } = useGlobal();

    useEffect(() => {
        for(const p of document.querySelectorAll(".content > article")){
            function handleShowParagraphScroll(){
                if(Client.Functions.isElementInViewport(p)){
                    p.style.transform = "translateY(0)";
                    p.style.opacity = 1;
                    window.removeEventListener("scroll", handleShowParagraphScroll);
                }
            }
            window.addEventListener("scroll", handleShowParagraphScroll);
            handleShowParagraphScroll();
        }
    }, [device.device])

    const showingParagraph = <article id={id}>
        {
            id === "origin" ? originContent :
            id === "interest" ? interestContent :
            id === "learning-style" ? learningStyle :
            <></>
        }
        <div className="fade"></div>
    </article>

    return (
        <>
            {index % 2 === 1 || (device.device === "sm" || device.device === "xs") ?
                <>
                    {showingParagraph}
                    <ArticleMedia id={id}/>
                </>
                :
                <>
                    <ArticleMedia id={id} />
                    {showingParagraph}
                </>
            }
        </>
    )
}