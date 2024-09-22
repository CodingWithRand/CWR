"use client"

import "./page.css"
import Client from "@/glient/util";

const { NavBar, CWRFooter } = Client.Components
const { Coroussel } = Client.Components.Dynamic

export default function MyProjects() {
  return (
    <>
      <NavBar />
      <Coroussel 
        totalPages={6} 
        corousselElements={[
          <div key={1} className="intro-page" style={{ backdropFilter: "blur(10px);" }}>
            <h1 className="title cwr-education">CWR Education</h1>
            <h2 className="subtitle cwr-education"><i>&quot;A journal based programming learning web application&quot;</i></h2>
            {/* <p className="development-status">Development Status: Prototype</p> */}
            <br />
            <p className="description cwr-education">This project is a web application project that is designed to be a programming learning space. The web theme is in space theme to makes it interesting. This web application is intended to be a Single Page Application (SPA), and is fully developed in React.</p>
            <br />
            <a className="visit-site" href="https://cwr-education.vercel.app" target="_blank">Visit Site</a>
            <a className="learn-more cwr-education" href="https://github.com/CodingWithRand/cwr/tree/general-education" target="_blank">Learn More</a>
          </div>,
          <div key={2} className="intro-page" style={{ backdropFilter: "blur(10px) brightness(0.5);" }}>
            <h1 className="title text-red-600">YouTube Converter</h1>
            <img src="/imgs/backend-images/icon/ytdownloader.ico" alt="YouTube Converter"/>
            <h2 className="subtitle text-white"><i>&quot;Download all your favorite videos as one go!&quot;</i></h2>
            {/* <p className="development-status text-white">Development Status: Unreleased</p> */}
            <p className="description text-white">This program only runs on PC. It&apos;s a program that allows you to download YouTube video in mp4 or mp3 format. You can also choose to download individually or download from a playlist. This program is developed in Python and use <b>pytube</b> module to download convert and download from YouTube</p>
            <br />
            <a className="learn-more text-white" href="https://github.com/CodingWithRand/YouTube-Converter" target="_blank">Learn More</a>
          </div>,
          <div key={3} className="intro-page" style={{ backdropFilter: "blur(5px)" }}>
            <h1 className="title text-white">Background Remover</h1>
            <img src="/imgs/backend-images/icon/bg-remover.ico" alt="Background Remover"/>
            <p className="description text-white">This program only runs on PC. It&apos;s a program that allows you to remove the background of an image and download it to your computer. This program is developed in Python and use two engines <b>Pillow</b> which is a module from python and <b>remove.bg</b> which is an API from <a className="text-red-500" href="https://www.remove.bg/" target="_blank">removebg</a></p>
            <br />
            <a className="learn-more text-white" href="https://github.com/CodingWithRand/Background-Remover" target="_blank">Learn More</a>
          </div>,
          <div key={4} className="intro-page" style={{ backdropFilter: "blur(5px) brightness(0.5);" }}>
            <h1 className="title text-neutral-800">Simple Survey Form</h1>
            <br />
            <p className="description text-white">A simple survey form to collect opinion from subscribers and viewers on my YouTube channel. The data will be stored in a database, and can be displayed as a table in the admin panel (User: CodingWithRand, Password: cwrcwrcwr). Developed in HTML, CSS, PHP and MySQL</p>
            <p className="description text-white">Note: This site is the new version of the original site since the old one got deleted</p>
            <br />
            <a className="visit-site" href="http://codingwithrand.infinityfreeapp.com/Inquiry/" target="_blank">Visit Site</a>
            <a className="learn-more text-white" href="https://github.com/CodingWithRand/cwr-php/tree/inquiry" target="_blank">Learn More</a>
          </div>,
          <div key={5} className="intro-page" style={{ backdropFilter: "blur(5px) brightness(0.5);" }}>
            <h1 className="title text-cyan-400">Caesars Cipher <br/>(Rot13 Encryption)</h1>
            <br />
            <p className="description text-white">This program is a simple encryption program that allows you to encrypt or decrypt text using the Caesar Cipher. It is developed in JavaScript.</p>
            <br />
            <a className="visit-site" href="http://codingwithrand.infinityfreeapp.com/caesar-cipher/" target="_blank">Try now!</a>
          </div>,
          <div key={6} className="intro-page" style={{ backdropFilter: "blur(10px);" }}>
            <h1 className="title text-white" id="devto-project-name">Camp Activities Inquiry</h1>
            <br />
            <p className="description text-white">This website project is for submitting to participate in the first community challenge of <a href="https://dev.to/" target="_blank" className="text-red-500">DEV.to</a> <b><a href="https://dev.to/devteam/join-our-first-community-challenge-the-frontend-challenge-8be" target="_blank">&quot;The Frontend Challenge&quot;</a></b> in the prompt of &quot;Glam Up My Markup 💅&quot; To brief up the prompt in the challenge I participated in, it&apos;s about using CSS and JavaScript to make the template HTML code look beautiful and interactive when showing on the website. It&apos;s not a proper form though, so you cannot really submit any information to the database. By the way, I really participated in the challenge, but I didn&apos;t win any prizes. You can check for the participation badge on my Dev.to account profile to make sure I really participated.</p>
            <br />
            <a className="visit-site" href="https://codingwithrand.github.io/DEV.to-challenge/" target="_blank">Visit Site</a>
            <a className="learn-more text-white" href="https://dev.to/codingwithrand/glam-up-my-markup-camp-activities-the-frontend-challenge-submission-1m4e" target="_blank">Learn More</a>
          </div>
        ]}
        corousselWrappersStyle={[

        ]}
      />
      <CWRFooter />
    </>
  );
}

