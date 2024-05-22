import { useParams } from "react-router-dom";
import { Functions } from "../../../scripts/util";
import { useEffect } from "react";
import { Quote } from "../utility-components";

export default function FoundationOfProgramming() {
    const { stageName, sectionName, page } = useParams();

    useEffect(() => {
        if(document.querySelector(".stages-section-name"))
            document.querySelectorAll(".stages-section-name").forEach((ssn) => {
                ssn.style.transition = "none";
                ssn.style.opacity = 0;
                setTimeout(() => ssn.style.transition = "", 100);
            });
        if(document.querySelector(".stage-paragraph.quotation .quote"))
            document.querySelectorAll(".stage-paragraph.quotation .quote").forEach((spqq) => {
                spqq.style.transition = "none";
                spqq.style.opacity = 0;
                setTimeout(() => spqq.style.transition = "", 100);
            });
        if(document.querySelector(".stage-paragraph.quotation .quote-scrollable-container"))  
            document.querySelectorAll(".stage-paragraph.quotation .quote-scrollable-container").forEach((spqp) => {
                spqp.style.transition = "none";
                spqp.style.transform = "translateY(100vh)";
                setTimeout(() => spqp.style.transition = "", 100);
            })
        if(document.querySelector("cite.citation"))
            document.querySelectorAll("cite.citation").forEach((c) => {
                c.style.transition = "none";
                c.style.opacity = 0;
                setTimeout(() => c.style.transition = "", 100);
            });
        if(document.querySelector(".stage-name")) document.querySelector(".stage-name").style.transform = "translateY(-15rem)";
        if(document.querySelector(".stage-paragraph.prologue p"))
            document.querySelectorAll(".stage-paragraph.prologue p").forEach((sppp) => {
                if(sppp.style.transition !== "")
                    sppp.style.transition = "none";
                    sppp.style.opacity = 0;
                    setTimeout(() => sppp.style.transition = "opacity ease-in 2s", 100);
            });
        switch(parseInt(page)){
            case 1:
                setTimeout(() => document.querySelector(".stage-name").style.transform = "translateY(0)", 1000);
                setTimeout(() => document.querySelector(".stages-section-name").style.opacity = 1, 2000);
                break;
            case 2:
                setTimeout(() => document.querySelector(".stage-paragraph.prologue p").style.opacity = 1, 4000);
                break;
        }
    }, [page])

    switch(parseInt(page)){
        case 1:
            return(
                <>
                    <h1 className="stage-name font-sedan-sc-regular responsive">{Functions.convertToTitleCase(stageName)}</h1>
                    <h3 className="stages-section-name font-league-spartan responsive">{Functions.convertToTitleCase(sectionName)}</h3>
                    <Quote
                        quote={"In this lesson, you will learn about the foundations of programming where it's full of historical and theoretical content. You won't be practicing much in this lesson, but you have to grasp the basic concept of programming, coding, and computer first."}
                        author={"CodingWithRand - Author"}
                        initialAnimationTime={4000}
                    />
                </>
            )
        case 2:
            return(
                <>
                    <br></br>
                    <h3 className="section-topic font-league-spartan responsive">How does a computer work?</h3>
                    <Quote
                        quote={"...A computer is a machine that can be programmed to automatically carry out sequences of arithmetic or logical operations (computation). Modern digital electronic computers can perform generic sets of operations known as programs. These programs enable computers to perform a wide range of tasks. The term computer system may refer to a nominally complete computer that includes the hardware, operating system, software, and peripheral equipment needed and used for full operation; or to a group of computers that are linked and function together, such as a computer network or computer cluster..."}
                        author={"Computer - Wikipedia"}
                        initialAnimationTime={1000}
                    />
                    <div className="stage-paragraph prologue responsive font-oswald">
                        <p style={{opacity: 0, transition: "opacity ease-in 2s"}}>So, that is how the computer works according to Wikipedia. But you all know they&apos;re explained in the very complex way, aren&apos;t they? As you see, you&apos;ve to process information you just receive which is kind of a waste of energy. So, let me simplify and point you out only the crucial parts of computer.</p>
                    </div>
                </>
            );
    }    
}