import Client from "@/app/global/client/util"

const { Dynamic } = Client.Components;
const { Image } = Dynamic;

export default function LearningStyle(){
    return(
        <div id="learning-style-media" className="w-[80%] h-full relative flex justify-center">
            <Image dir="stickers/" name="me2.png" constant alt="myself-love-coding"/>
            <Image dir="stickers/" name="chatgirlpt.png" constant alt="mentor-chatgpt"/>
        </div>
    )
}