import Client from "@/glient/util"
import { useEffect } from "react";
import { useGlobal } from "@/glient/global";

const { Dynamic } = Client.Components;
const { Image } = Dynamic;

export default function ProgrammingInterest() {
    const { device } = useGlobal();
    useEffect(() => {
        function handleInterestScroll(){
            if(Client.Functions.isElementInViewport(document.getElementById("interest-media"))){
                for(const media of document.getElementById("interest-media").children){
                    media.style.transform = "translateY(0)";
                    media.style.opacity = 1;
                }
                window.removeEventListener("scroll", handleInterestScroll);
            }
        }
        window.addEventListener("scroll", handleInterestScroll)
        return () => window.removeEventListener("scroll", handleInterestScroll);
    }, [device.device])

    return (
        <div id="interest-media" className="w-[80%] h-full relative flex justify-center">
            <Image name="development.png" dir="stickers/" constant alt="development" style={{ transition: "transform 0.5s 0.2s ease-in-out, opacity 0.5s 0.2s ease-in-out", transform: "translateY(-10%)", opacity: 0 }} width="400" height="400"/>
            {/* <a href="https://www.freepik.com/free-vector/desktop-smartphone-app-development_10276838.htm#fromView=search&page=1&position=1&uuid=eb176483-e73f-4186-bc4f-bb7d160993fc">Image by freepik</a> */}
            <Image name="me1.png" dir="stickers/" constant alt="myself-love-coding" cls="absolute bottom-0 left-0" style={{ transition: "transform 0.5s 0.4s ease-in-out, opacity 0.5s 0.4s ease-in-out", transform: "translateY(-10%)", opacity: 0 }} width="200" height="200"/>

        </div>
    )
}