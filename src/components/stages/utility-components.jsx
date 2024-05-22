import { useEffect } from "react"
import { useParams } from "react-router-dom";

export function Quote({ quote, author, initialAnimationTime }){
    const { page } = useParams();

    useEffect(() => {
        document.querySelectorAll(".stage-paragraph.quotation .quote").forEach((q) => setTimeout(() => q.style.opacity = 1, initialAnimationTime));
        setTimeout(() => document.querySelector(".stage-paragraph.quotation .quote-scrollable-container").style.transform = "translateY(0)", initialAnimationTime + 1000);
        setTimeout(() => document.querySelector("cite.citation").style.opacity = 1, initialAnimationTime + 2000);
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