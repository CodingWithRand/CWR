"use client"

import "./page.css";
import { Intro, SkillsBlock } from "./components/client/constructor-components";
import { Article } from "./components/client/utility-components";
import Client from "./global/client/util";

export default function Home() {
  
  return (
    <>
      <Intro />
      <main className="relative py-12">
          <section id="about-me" style={{width: "100vw", height: "auto"}}>
              <article className="content">
                <Article id="origin" index={1} />
                <Article id="interest" index={2} />
                <Article id="learning-style" index={3} />
              </article>
              <article className="skills">
                <SkillsBlock />
              </article>
              <i className="text-black dark:text-white text-center p-4 sm:text-2xl lg:text-4xl w-full block">&quot;The only way to do great work is to love what you do&quot;</i>
          </section>
      </main>
      <Client.Components.CWRFooter />
    </>
  );
}

