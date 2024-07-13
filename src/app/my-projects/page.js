"use client"

import "./page.css"
import Client from "@/glient/util";

const { NavBar, CWRFooter } = Client.Components
const { Coroussel, Image } = Client.Components.Dynamic

export default function MyProjects() {
  return (
    <>
      <NavBar />
      <Coroussel 
        totalPages={2} 
        corousselElements={[
          <div key={1} className="intro-page" style={{ backdropFilter: "blur(10px);" }}>
            <h1 className="title cwr-education">CWR Education</h1>
            <h2 className="subtitle cwr-education"><i>&quot;A journal based programming learning web application&quot;</i></h2>
            <p className="development-status cwr-education">Development Status: Prototype</p>
            <br />
            <p className="description cwr-education">This project is a web application project that is designed to be a programming learning space. The web theme is in space theme to makes it interesting. This web application is intended to be a Single Page Application (SPA), and is fully developed in React.</p>
            <br />
            <a className="learn-more cwr-education" href="https://github.com/CodingWithRand/cwr/tree/general-education" target="_blank">Learn More</a>
          </div>,
          <div key={2} className="intro-page" style={{ backdropFilter: "blur(10px) brightness(0.5);" }}>
            <h1 className="title text-red-600">YouTube Converter</h1>
            <h2 className="subtitle text-white"><i>&quot;Download all your favorite videos as one go!&quot;</i></h2>
            <p className="development-status text-white">Development Status: Unreleased</p>
            <br />
            <p className="description text-white">This program only runs on PC. It&apos;s a program that allows you to download YouTube video in mp4 or mp3 format. You can also choose to download individually or download from a playlist. This program is developed in Python and use <b>pytube</b> module to download convert and download from YouTube</p>
            <br />
            <a className="learn-more text-white" href="https://github.com/CodingWithRand/YouTube-Converter" target="_blank">Learn More</a>
        </div>
        ]}
        corousselWrappersStyle={[

        ]}
      />
      <CWRFooter />
    </>
  );
}

