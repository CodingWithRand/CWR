"use server"

import "./page.css";
import { Global } from "@/glient/global";
import { Intro, SignOutBTN } from "./components/client";


export default async function Home() {
  return (
    <>
      <Intro />
      <main>
          <section id="about-us" style={{width: "100vw", height: "100vh"}}>
              <article className="content">
                <article>
                  <h1>Who am I?</h1>
                  <p>An API, or Application Programming Interface, is a software intermediary that enables two or more computer programs or components to communicate with each other. It acts as an intermediary layer that processes data transfers between systems, allowing companies to open their application data and functionality to external third-party developers, business partners, and internal departments within their companies. APIs are a set of protocols and instructions written in programming languages such as C++ or JavaScript that determine how two software components will communicate with each other. Developers use APIs to bridge the gaps between small, discrete chunks of code in order to create applications that are powerful, resilient, secure, and able to meet user needs. A REST API, also known as RESTful API, conforms to the constraints of REST architectural style and allows for interaction with RESTful web services.</p>
                  <div className="fade"></div>
                </article>
                <article>
                  <h1>What are our API for?</h1>
                  <p>Our API has various purposes. There are many types of APIs we have gathered here. They can be used for websites, or games as an instance</p>
                  <div className="fade"></div>
                </article>
              </article>
          </section>
      </main>
      <SignOutBTN />
      {/* 
      <a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Catalin Fertu - Flaticon</a> 
      <a href="https://www.flaticon.com/free-icons/triangle" title="triangle icons">Triangle icons created by Dave Gandy - Flaticon</a>
      */}
    </>
  );
}

