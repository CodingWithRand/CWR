import Client from "@/glient/util"
import { useEffect } from "react";

const { Dynamic, Media } = Client.Components;
const { Image } = Dynamic;

export default function LearningStyle(){

    useEffect(() => {
        function handleShowClassScroll(){
            if(Client.Functions.isElementInViewport(document.getElementById("learning-style-media"))){
                for(const stand of Array.from(document.querySelectorAll("div.monitor-stand")).reverse()){
                    stand.style.transform = "translateY(0)";
                    stand.style.opacity = 1;                    
                }
                document.querySelector("#learning-style-media video").style.transform = "translateY(0)";
                document.querySelector("#learning-style-media video").style.opacity = 1;
                for(const char of document.querySelectorAll("img.learning-style-cartoon-character")){
                    char.style.transform = "translateY(0)";
                    char.style.opacity = 1;
                }
                window.removeEventListener("scroll", handleShowClassScroll);
            }
        }
        window.addEventListener("scroll", handleShowClassScroll)
        handleShowClassScroll();
        return () => window.removeEventListener("scroll", handleShowClassScroll);
    }, [])

    return(
        <div id="learning-style-media" className="w-[80%] h-full relative flex justify-center gap-y-4 flex-col items-center">
            <Media 
                cls="w-full rounded-lg border-4 border-solid opacity-0 border-black dark:border-neutral-400 bg-neutral-900"
                style={{ height: "min-content", maxHeight: "250px", minHeight: "200px", transition: "transform 0.5s 0.4s var(--elastic), opacity 0.5s 0.4s ease-in-out", transform: "translateY(-10%)" }}
                mediaType="video" 
                mediaSrc="python.mp4" 
                firebase
                muted
                autoPlay
                loop
                controls
            />
            <div className="w-1/2 monitor-stand" style={{ transitionDelay: "0.2s" }} />
            <div className="w-1/4 monitor-stand" />
            <Image dir="stickers/" name="me2.png" constant alt="myself-love-coding" cls="learning-style-cartoon-character left-0" />
            <Image dir="stickers/" name="chatgirlpt.png" constant alt="mentor-chatgpt" cls="learning-style-cartoon-character right-0" />
        </div>
    )
}