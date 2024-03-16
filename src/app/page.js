"use client"

import "./page.css";
import { Intro } from "./components/client/constructor-components";
import { Article, SignOutBTN } from "./components/client/utility-components";

export default function Home() {
  return (
    <>
      <Intro />
      <main>
          <section id="about-me" style={{width: "100vw", height: "auto"}}>
              <article className="content">
                <Article id="origin" index={1} />
                <Article id="interest" index={2} />
                <Article id="learning-style" index={3} />
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

