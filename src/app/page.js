"use client"

import "./page.css";
import { Intro } from "./components/client/constructor-components";
import { Article } from "./components/client/utility-components";
import Client from "./global/client/util";

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
      <Client.Components.CWRFooter />
    </>
  );
}

