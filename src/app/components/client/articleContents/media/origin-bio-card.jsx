import { useEffect } from "react";
import Client from "@/app/global/client/util";
const { Dynamic } = Client.Components;
const { Image } = Dynamic;

export default function OriginBioCard() {
    useEffect(() => {
        function handleShowCardScroll(){
            if(Client.Functions.isElementInViewport(document.getElementById("bio-card"))){
                document.getElementById("bio-card").style.transform = "rotate3d(0.5, -1, 1, 735deg)";
                document.querySelector(".effect-box").style.rotate = "730deg";
                document.querySelector(".effect-box").style.opacity = 1;
                window.removeEventListener("scroll", handleShowCardScroll);
            }
        }
        window.addEventListener("scroll", handleShowCardScroll)
        return () => window.removeEventListener("scroll", handleShowCardScroll);
    }, [])
    return(
        <div className="flex items-center justify-center w-[80%] relative threeD-screen my-14 md:my-0">
            <div id="bio-card" style={{ transition: "transform 1s ease-in-out", transform: "rotate3d(0.5, -1, 1, -143.1deg)" }} data-v0-t="card">
                <span className="absolute text-[0.1em] top-2 left-2">Created by <a target="_new" href="https://v0.dev" className="outside-link">v0.dev</a></span>
                <div className="flex flex-col items-center space-y-2 p-3 sm:p-6">
                    <div className="rounded-full overflow-hidden border-2 border-neutral-500 w-16 h-16 nmob:w-20 nmob:h-20 sm:w-24 sm:h-24">
                        <Image name="channel_logo_new.png" constant alt="Avatar" style={{ aspectRatio: 96 / 96, objectFit: "cover" }} />
                    </div>
                    <div className="prose max-w-none w-full text-center text-xs nmob:text-sm sm:text-base">
                        <p><i>&quot;A young ambitious leisurely junior developer&quot;</i></p>
                    </div>
                </div>
                <div className="p-3 sm:p-6">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs nmob:text-sm sm:text-base">
                        <div className="info-list">
                            <dt>Name</dt>
                            <dd>Thanwisit Angsachon</dd>
                        </div>
                        <div className="info-list">
                            <dt>Occupation</dt>
                            <dd>Grade 12 Student</dd>
                        </div>
                        <div className="info-list">
                            <dt>Location</dt>
                            <dd>Chiang Mai, Thailand</dd>
                            </div>
                        <div className="info-list">
                            <dt>Twitter</dt>
                            <dd>@rand0mtutorial</dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div className="effect-box" style={{ transition: "rotate 1s ease-in-out, opacity 1s ease-in-out", opacity: 0, rotate: "-143.1deg" }}>
                <Image name="channel_logo_old.png" constant alt="old-logo" width="50" height="50" cls="spinning-dice" />
                <Image name="channel_logo_old.png" constant alt="old-logo" width="40" height="40" cls="spinning-dice" />
                <Image name="channel_logo_old.png" constant alt="old-logo" width="30" height="30" cls="spinning-dice" />
                <Image name="channel_logo_old.png" constant alt="old-logo" width="25" height="25" cls="spinning-dice" />
                <Image name="channel_logo_old.png" constant alt="old-logo" width="20" height="20" cls="spinning-dice" />
                <Image name="channel_logo_old.png" constant alt="old-logo" width="50" height="50" cls="spinning-dice" />
                <Image name="channel_logo_old.png" constant alt="old-logo" width="40" height="40" cls="spinning-dice" />
                <Image name="channel_logo_old.png" constant alt="old-logo" width="30" height="30" cls="spinning-dice" />
                <Image name="channel_logo_old.png" constant alt="old-logo" width="25" height="25" cls="spinning-dice" />
                <Image name="channel_logo_old.png" constant alt="old-logo" width="20" height="20" cls="spinning-dice" />
            </div>
        </div>
    )
}