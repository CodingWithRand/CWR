import { useParams } from "react-router-dom";
import { Functions } from "../../../scripts/util";
import { useEffect } from "react";
import { ComputerComponent, Quote } from "../utility-components";

export default function FoundationOfProgramming() {
    const { stageName, sectionName, page } = useParams();

    useEffect(() => {
        let timeoutIds = [];
        if(page){
            if(document.querySelector(".stages-section-name"))
                document.querySelectorAll(".stages-section-name").forEach((ssn) => {
                    ssn.style.transition = "none";
                    ssn.style.opacity = 0;
                    timeoutIds.push(setTimeout(() => ssn.style.transition = "", 100));
                });
            if(document.querySelector(".stage-paragraph.quotation .quote"))
                document.querySelectorAll(".stage-paragraph.quotation .quote").forEach((spqq) => {
                    spqq.style.transition = "none";
                    spqq.style.opacity = 0;
                    timeoutIds.push(setTimeout(() => spqq.style.transition = "", 100));
                });
            if(document.querySelector(".stage-paragraph.quotation .quote-scrollable-container"))  
                document.querySelectorAll(".stage-paragraph.quotation .quote-scrollable-container").forEach((spqp) => {
                    spqp.style.transition = "none";
                    spqp.style.transform = "translateY(100vh)";
                    timeoutIds.push(setTimeout(() => spqp.style.transition = "", 100));
                })
            if(document.querySelector("cite.citation"))
                document.querySelectorAll("cite.citation").forEach((c) => {
                    c.style.transition = "none";
                    c.style.opacity = 0;
                    timeoutIds.push(setTimeout(() => c.style.transition = "", 100));
                });
            if(document.querySelector(".stage-name")) document.querySelector(".stage-name").style.transform = "translateY(-15rem)";
            if(document.querySelector(".stage-paragraph.prologue p"))
                document.querySelectorAll(".stage-paragraph.prologue p").forEach((sppp) => {
                    if(sppp.style.transition !== "")
                        sppp.style.transition = "none";
                        sppp.style.opacity = 0;
                        timeoutIds.push(setTimeout(() => sppp.style.transition = "opacity ease-in 2s", 100));
                });
            switch(parseInt(page)){
                case 1:
                    timeoutIds.push(setTimeout(() => document.querySelector(".stage-name").style.transform = "translateY(0)", 1000));
                    timeoutIds.push(setTimeout(() => document.querySelector(".stages-section-name").style.opacity = 1, 2000));
                    break;
                case 2:
                    document.querySelector(".section-topic").style.opacity = 1;
                    timeoutIds.push(setTimeout(() => document.querySelector(".stage-paragraph.prologue p").style.opacity = 1, 4000));
                    break;
            }
        }else{
            timeoutIds.forEach((tid) => clearTimeout(tid));
        }
        return () => timeoutIds.forEach((tid) => clearTimeout(tid));
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
                        <p style={{opacity: 0, transition: "opacity ease-in 2s"}}>So, that is the definition of a computer according to Wikipedia. But you all know they&apos;re explained in the very complex way, aren&apos;t they? As you see, you&apos;ve to process information you just receive which is kind of a waste of energy. So, let me simplify and point you out only the crucial parts of computer.</p>
                    </div>
                </>
            );
        case 3:
            return(
                <>
                    <div className="stage-paragraph responsive prologue font-oswald">Computer does consist... (I only bring up the crucial components that will be beneficial later for programming)</div>
                    <div className="computer-component-table">
                        {/* 
                            <a href="https://www.flaticon.com/free-icons/computer-mouse" title="computer mouse icons">Computer mouse icons created by Freepik - Flaticon</a> 
                            <a href="https://www.flaticon.com/free-icons/electric-keyboard" title="electric keyboard icons">Electric keyboard icons created by flatart_icons - Flaticon</a>
                            <a href="https://www.flaticon.com/free-icons/webcam" title="webcam icons">Webcam icons created by Freepik - Flaticon</a>
                            <a href="https://www.flaticon.com/free-icons/scanner" title="scanner icons">Scanner icons created by Smashicons - Flaticon</a>
                            <a href="https://www.flaticon.com/free-icons/sensor" title="sensor icons">Sensor icons created by Freepik - Flaticon</a>
                            <a href="https://www.flaticon.com/free-icons/radio" title="radio icons">Radio icons created by Freepik - Flaticon</a>
                            <a href="https://www.flaticon.com/free-icons/touchscreen" title="touchscreen icons">Touchscreen icons created by Mehwish - Flaticon</a>

                            <a href="https://www.flaticon.com/free-icons/loud-speaker" title="loud speaker icons">Loud speaker icons created by Freepik - Flaticon</a>
                            <a href="https://www.flaticon.com/free-icons/monitor" title="monitor icons">Monitor icons created by Freepik - Flaticon</a>
                            <a href="https://www.flaticon.com/free-icons/printer" title="printer icons">Printer icons created by Freepik - Flaticon</a>
                            <a href="https://www.flaticon.com/free-icons/projector" title="projector icons">Projector icons created by xnimrodx - Flaticon</a>
                            <a href="https://www.flaticon.com/free-icons/headphones" title="headphones icons">Headphones icons created by Freepik - Flaticon</a>

                            <a href="https://www.flaticon.com/free-icons/graphic-card" title="graphic card icons">Graphic card icons created by Taufik Ramadhan - Flaticon</a>
                            <a href="https://www.flaticon.com/free-icons/technology" title="technology icons">Technology icons created by Freepik - Flaticon</a>
                        */}
                        <ComputerComponent
                            title="Input Devices"
                            elementNumber={7}
                            componentNames={["Mouse", "Keyboard", "Webcam", "Scanner", "Sensor", "Microphone", "Touchscreen"]}
                            componentDescriptions={[
                                "Take the position of the mouse user moves as an input",
                                "Take the data from which key is pressed as an input",
                                "Take the video and audio from detected as an input",
                                "Take the paper picture as an input",
                                "Take whatever the sensor detected as an input",
                                "Take audio as an input",
                                "Take the touch position as an input"
                            ]}
                            bgColor="violet"
                        />
                        <ComputerComponent
                            title="Output Devices"
                            elementNumber={5}
                            componentNames={["Monitor", "Speaker", "Printer", "Projector", "Headphones"]}
                            componentDescriptions={[
                                "Output the processed data in any kind of form by visually displaying on the monitor",
                                "Output the audio by playing on the speaker",
                                "Output the data in form of a paper printed document",
                                "Same as the monitor. But instead of displaying on the monitor, it is projected on a projector screen (a blank white wall)",
                                "Same as the speaker. But the audio is played privately on the headphones"
                            ]}
                            bgColor="purple"
                        />
                        <ComputerComponent
                            title="Processor"
                            elementNumber={2}
                            componentNames={["CPU", "GPU"]}
                            componentDescriptions={[
                                "A central processing unit (CPU), also called a central processor, main processor, or just processor, is the most important processor in a given computer. Its electronic circuitry executes instructions of a computer program, such as arithmetic, logic, controlling, and input/output (I/O) operations. This role contrasts with that of external components, such as main memory and I/O circuitry, and specialized coprocessors such as graphics processing units (GPUs). - Wikipedia",
                                "A graphics processing unit (GPU) is a specialized electronic circuit initially designed to accelerate computer graphics and image processing (either on a video card or embedded on motherboards, mobile phones, personal computers, workstations, and game consoles). After their initial design, GPUs were found to be useful for non-graphic calculations involving embarrassingly parallel problems due to their parallel structure. Other non-graphical uses include the training of neural networks and cryptocurrency mining. - Wikipedia"
                            ]}
                            bgColor="blueviolet"
                        />
                    </div>
                </>
            );
        case 4:
            return (
                <div className="computer-component-table">
                    {/* <ComputerComponent
                        title="Memory"
                    />
                    <ComputerComponent
                        title="Storage Units"
                    />
                    <ComputerComponent
                        title="Others"
                    /> */}
                </div>
            );
    }    
}