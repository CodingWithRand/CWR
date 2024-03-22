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
            <li><Image dir="icon/" name="react-2.svg" constant alt="react-logo" width={20} height={20}/>&nbsp;<a href="https://react.dev" target="_blank">React</a></li>
            <li><Image dir="icon/" name="nextjs-icon-background.svg" alt="next-logo" width={20} height={20}/>&nbsp;<a href="https://nextjs.org" target="_blank">Next.js</a></li>
            <li><Image dir="icon/" name="vercel.png" constant alt="vercel-logo" width={20} height={20}/>&nbsp;<a href="https://vercel.com" target="_blank">Vercel</a></li>
            <li><Image dir="icon/" name="firebase-1.svg" constant alt="firebase-logo" width={20} height={20}/>&nbsp;<a href="https://firebase.google.com" target="_blank">Firebase</a></li>
          </ul>
        </div>
        <div className="credit-card">
          <h1>Medias from</h1>
          <ul>
            <li><a href="https://www.flaticon.com/free-icons/search" title="search icons">Search icons created by Catalin Fertu - Flaticon</a></li>
            <li><a href="https://www.flaticon.com/free-icons/triangle" title="triangle icons">Triangle icons created by Dave Gandy - Flaticon</a></li>
            <li><a href="https://www.freepik.com/free-vector/desktop-smartphone-app-development_10276838.htm#fromView=search&page=1&position=1&uuid=eb176483-e73f-4186-bc4f-bb7d160993fc">Desktop and smartphone app development - Image by freepik</a></li>
          </ul>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-full light-theme-content-article-fade pt-6 sm:pt-12 dark:h-3/4 dark:dark-theme-footer-gradient"></div>
      </footer>
    </>
  );
}

