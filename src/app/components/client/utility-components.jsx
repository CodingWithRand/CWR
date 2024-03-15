import { useGlobal } from "@/app/global/client/global";
import { originContent, interestContent } from "./articleContents/paragraphs";
import { useEffect } from "react";
import { signOut } from "@firebase/auth";
import { auth } from "@/glient/firebase";
import OriginBioCard from "./articleContents/media/origin-bio-card";
import Client from "@/app/global/client/util";

export function SignOutBTN() {
    return (
        <button onClick={async () => {
            try {
                const req = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: `util/authenticationSessions/${auth.currentUser.uid}/Web`, writeData: { authenticated: false, token: null }, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
                });
                const res = await req.json();
                console.log(res);
            } catch (e) { console.error(e) }
            signOut(auth);
            window.location.replace("/registration");
        }}>Sign Out</button>
    )
}

function ArticleMedia({ id }){
    switch(id){
        case "origin": return <OriginBioCard />
    }
}

export function Article({ id, index }) {
    const { device } = useGlobal();

    useEffect(() => {
        console.log("a")
        for(const p of document.querySelectorAll(".content > article")){
            function handleShowParagraphScroll(){
                if(Client.Functions.isElementInViewport(p)){
                    p.style.transform = "translateY(0)";
                    p.style.opacity = 1;
                    window.removeEventListener("scroll", handleShowParagraphScroll);
                }
            }
            window.addEventListener("scroll", handleShowParagraphScroll)  
        }
    }, [device.device])

    const showingParagraph = <article id={id}>
        {
            id === "origin" ? originContent :
            id === "interest" ? interestContent :
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
                    <img />
                    {showingParagraph}
                </>
            }
        </>
    )
}