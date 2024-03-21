"use client"

import "./page.css";
import { Intro } from "./components/client/constructor-components";
import { Article } from "./components/client/utility-components";
import Client from "./global/client/util";

const { Dynamic } = Client.Components;
const { Image } = Dynamic;

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
      <footer className="footer">
        <div className="credit-card">
          <h1>Powered by</h1>
          <ul>
            <li><Image dir="icon/" name="react-2.svg" constant alt="react-logo" width={20} height={20}/>&nbsp;<a src="https://react.dev" target="_blank">React</a></li>
            <li><Image dir="icon/" name="next-js.svg" constant alt="react-logo" width={20} height={20}/>Next.js</li>
            <li>Vercel</li>
            <li>Firebase</li>
          </ul>
        </div>
        <div className="credit-card">
          <h1>Media from</h1>
          <ul>
            <li><a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Catalin Fertu - Flaticon</a></li>
            <li><a href="https://www.flaticon.com/free-icons/triangle" title="triangle icons">Triangle icons created by Dave Gandy - Flaticon</a></li>
          </ul>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-full light-theme-content-article-fade pt-6 sm:pt-12 dark:h-3/4 dark:dark-theme-footer-gradient"></div>
      </footer>
      {/* 
      <a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Catalin Fertu - Flaticon</a> 
      <a href="https://www.flaticon.com/free-icons/triangle" title="triangle icons">Triangle icons created by Dave Gandy - Flaticon</a>
      */}
    </>
  );
}

