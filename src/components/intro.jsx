import '../css/use/intro.css';
import { useState, useEffect } from 'react';
import { Components } from '../scripts/util';
import { useNavigate } from 'react-router-dom';
import { Functions } from '../scripts/util';
import { useSearchParams } from 'react-router-dom';
import { useGlobal } from '../scripts/global';
import { BgMusicController } from './setup';

const { Dynamic } = Components;
const { Image } = Dynamic;

export default function LoadingScreen() {
  const { login } = useGlobal();
  const navigator = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if(searchParams.get('loadingState') === 'proceeded'){
      if(login.isLoggedIn){
        navigator(`/${searchParams.get("redirectFrom") || ""}`);
        // window.location.reload();
      }
      else navigator('/greeting');
    };
  }, [searchParams.get('loadingState')]);
  

  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const [orientX, setOrientX] = useState(0);
  const [orientY, setOrientY] = useState(0);
  const [orientZ, setOrientZ] = useState(0);

  const [scale, setScale] = useState(1);

  const [animationStyle, setAnimStyle] = useState('initial');

  const [lsOffset, setLSOffset] = useState(0);
  const [lsOpacity, setLSOpacity] = useState(1);
  
  const [vw, setVW] = useState(window.innerWidth);
  const [vh, setVH] = useState(window.innerHeight);

  const [loadingQuote, setLoadingQuote] = useState('');

  const equalizer = 5;

  const TTF = {
    linear: {
      classic: "linear",
      elastic: "linear(0 0%, 0.22 2.1%, 0.86 6.5%, 1.11 8.6%, 1.3 10.7%, 1.35 11.8%, 1.37 12.9%, 1.37 13.7%, 1.36 14.5%, 1.32 16.2%, 1.03 21.8%, 0.94 24%, 0.89 25.9%, 0.88 26.85%, 0.87 27.8%, 0.87 29.25%, 0.88 30.7%, 0.91 32.4%, 0.98 36.4%, 1.01 38.3%, 1.04 40.5%, 1.05 42.7%, 1.05 44.1%, 1.04 45.7%, 1 53.3%, 0.99 55.4%, 0.98 57.5%, 0.99 60.7%, 1 68.1%, 1.01 72.2%, 1 86.7%, 1 100%)",
      bounce: "linear(0 0%, 0 2.27%, 0.02 4.53%, 0.04 6.8%, 0.06 9.07%, 0.1 11.33%, 0.14 13.6%, 0.25 18.15%, 0.39 22.7%, 0.56 27.25%, 0.77 31.8%, 1 36.35%, 0.89 40.9%, 0.85 43.18%, 0.81 45.45%, 0.79 47.72%, 0.77 50%, 0.75 52.27%, 0.75 54.55%, 0.75 56.82%, 0.77 59.1%, 0.79 61.38%, 0.81 63.65%, 0.85 65.93%, 0.89 68.2%, 1 72.7%, 0.97 74.98%, 0.95 77.25%, 0.94 79.53%, 0.94 81.8%, 0.94 84.08%, 0.95 86.35%, 0.97 88.63%, 1 90.9%, 0.99 93.18%, 0.98 95.45%, 0.99 97.73%, 1 100%)",
      emphasized: "linear(0 0%, 0 1.8%, 0.01 3.6%, 0.03 6.35%, 0.07 9.1%, 0.13 11.4%, 0.19 13.4%, 0.27 15%, 0.34 16.1%, 0.54 18.35%, 0.66 20.6%, 0.72 22.4%, 0.77 24.6%, 0.81 27.3%, 0.85 30.4%, 0.88 35.1%, 0.92 40.6%, 0.94 47.2%, 0.96 55%, 0.98 64%, 0.99 74.4%, 1 86.4%, 1 100%)",
    },
    easeInOut: {
      classic: "ease-in-out",
      sine: "cubic-bezier(0.45, 0.05, 0.55, 0.95)",
      quadratic: "cubic-bezier(0.46, 0.03, 0.52, 0.96)",
      cubic: "cubic-bezier(0.65, 0.05, 0.36, 1)",
      slowIn: "cubic-bezier(0.4, 0, 0.2, 1)",
      back: "cubic-bezier(0.68, -0.55, 0.27, 1.55)"
    },
    easeIn: {
      classic: "ease-in",
      sine: "cubic-bezier(0.47, 0, 0.75, 0.72)",
      quadratic: "cubic-bezier(0.55, 0.09, 0.68, 0.53)",
      cubic: "cubic-bezier(0.55, 0.06, 0.68, 0.19)",
      back: "cubic-bezier(0.6, -0.28, 0.74, 0.05)",
      fast_out_linear_in: "cubic-bezier(0.4, 0, 1, 1)",
    },
    easeOut: {
      classic: "ease-out",
      sine: "cubic-bezier(0.39, 0.58, 0.57, 1)",
      quadratic: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      cubic: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      back: "cubic-bezier(0.18, 0.89, 0.32, 1.28)",
      linear_out_slow_in: "cubic-bezier(0, 0, 0.2, 1)"
    }
  };

  function updateShadow() {
    const computedStyle = window.getComputedStyle(document.querySelector(".dice"));
    const transform = computedStyle.getPropertyValue('transform');
    const matrix = new DOMMatrix(transform);
    const translationX = matrix.m41;
    const translationY = matrix.m42;

    const newX = translationX - 30 + equalizer;
    const newY = translationY + 20;

    document.querySelector(".dice-shadow").style.right = `${-newX}px`;
    document.querySelector(".dice-shadow").style.top = `${newY}px`;
  }

  async function initial_half_parabola(configs) {
    let negateMultiplier = 1;
    if (configs.inverse) negateMultiplier = -1;
    for (let i = 0; i < configs.highestPoints; i++) {
      if (i === configs.objHeight) break
      await Functions.jobDelay(() => {
        setOrientX((prevOrientX) => (prevOrientX + Math.floor(Math.random() * configs.spinningRate)));
        setOrientY((prevOrientY) => (prevOrientY + Math.floor(Math.random() * configs.spinningRate)));
        setOrientZ((prevOrientZ) => (prevOrientZ + Math.floor(Math.random() * configs.spinningRate)));
        setOffsetX((prevOffsetX) => (prevOffsetX + configs.XVelocity));
        setOffsetY((prevOffsetY) => (prevOffsetY + (negateMultiplier * (Math.pow(i, configs.YVelocity)))));
        setScale((prevScale) => { if (prevScale !== configs.maxPerspectiveScale) return prevScale + ((configs.maxPerspectiveScale - 1) / configs.highestPoints); });
        updateShadow();
      }, configs.accelerator)
    };
  };

  async function end_half_parabola(configs) {
    let negateMultiplier = 1;
    if (configs.inverse) negateMultiplier = -1;
    for (let i = configs.highestPoints; i > 0; i--) {
      if (i === configs.bounceRate) break;
      await Functions.jobDelay(() => {
          setOrientX((prevOrientX) => (prevOrientX - Math.floor(Math.random() * configs.spinningRate)))
          setOrientY((prevOrientY) => (prevOrientY - Math.floor(Math.random() * configs.spinningRate)))
          setOrientZ((prevOrientZ) => (prevOrientZ - Math.floor(Math.random() * configs.spinningRate)))
          setOffsetX((prevOffsetX) => (prevOffsetX + configs.XVelocity));
          setOffsetY((prevOffsetY) => (prevOffsetY - (negateMultiplier * (Math.pow((i - 1), configs.YVelocity)))));
          updateShadow()
      }, configs.accelerator)
    };
  };

  async function parabola_motion(configs, animStyle) {
    setAnimStyle(animStyle);
    configs.maxPerspectiveScale = configs.maxPerspectiveScale / 2;
    await initial_half_parabola(configs);
    await end_half_parabola(configs);
  };

  async function end_anim(accelerator) {
    for (let i = 0; i < 10; i++) await Functions.jobDelay(() => updateShadow(), accelerator);
  };

  useEffect(() => {
    function setViewportSize() {
      setVW(window.innerWidth);
      setVH(window.innerHeight);
    };

    window.addEventListener('resize', setViewportSize);

    return () => window.removeEventListener('resize', setViewportSize);
  }, [vw, vh]);

  useEffect(() => {
    /* Configs -> {
      accelerator: number -> indicate how fast the animation goes, the more you input, the slower it goes
      XVelocity: number -> indicate how far the animation go each keyframe (x axis: vw)
      YVelocity: number -> indicate how far the animation go each keyframe (y axis: vh)
      highestPoints: number [int] -> the highest point in y axis that the obj will reach
      spinningRate: number -> indicate the frequency of shaking
      bounceRate: number [int] -> indicate how much height obj will stop bouncing to
      objHeight: number [int] -> indicate the height where the object starts falling
      maxPerspetiveScale: number -> indicate the scale increment when the object is getting closer (must greater than 2)
    } */
    (async () => {
      if(searchParams.get("loadingState") === "proceeded") return;
      if(!searchParams.get("loadingState")){
        await parabola_motion({
          accelerator: 50,
          XVelocity: 2,
          YVelocity: 1,
          highestPoints: 10,
          spinningRate: 20,
          bounceRate: 9,
          maxPerspectiveScale: window.innerWidth > 640 ? 3 : 2.1
        }, TTF.easeOut.linear_out_slow_in);
        await parabola_motion({
          accelerator: 50,
          XVelocity: window.innerWidth > 640 ? 0.8 : 0.5,
          YVelocity: window.innerWidth > 640 ? 1 : 0.75,
          highestPoints: 7,
          spinningRate: 90,
          objHeight: 4,
          maxPerspectiveScale: window.innerWidth > 640 ? 4 : 2.8,
          inverse: true,
        }, TTF.easeOut.cubic);
        await parabola_motion({
          accelerator: 50,
          XVelocity: window.innerWidth > 640 ? 0.5 : 0.25,
          YVelocity: window.innerWidth > 640 ? 0.75 : 0.5,
          highestPoints: 5,
          spinningRate: -85,
          objHeight: 2,
          maxPerspectiveScale: window.innerWidth > 640 ? 4 : 3.5,
          inverse: true
        }, TTF.easeInOut.cubic);
        for (let i = 0; i < 4; i++) {
          await Functions.jobDelay(() => {
            setOrientX((prevOrientX) => (prevOrientX - Math.floor(Math.random() * prevOrientX)));
            setOrientY((prevOrientY) => (prevOrientY - Math.floor(Math.random() * prevOrientY)));
            setOrientZ((prevOrientZ) => (prevOrientZ - Math.floor(Math.random() * prevOrientZ)));
          }, 120);
        };
        setOrientX(90); setOrientY(0); setOrientZ(0);
      };

      await Functions.jobDelay(() => {
        document.querySelector('.loading-screen').style.width = '100vw';
        document.querySelector('.loading-screen').style.height = '100vh';
        document.querySelector('.loading-screen').style.opacity = 1;
      }, searchParams.get("loadingState") ? 0 : 1000);
      await Functions.jobDelay(() => {
        document.querySelector('.title').style.width = '100%';
        document.querySelector('.stick').style.transitionTimingFunction = 'cubic-bezier(1, 0.1, 0, 1.25)';
        document.querySelector('.stick').classList.add('cursor-pointer-animate');
      }, searchParams.get("loadingState") ? 0 : 700);
      await Functions.jobDelay(() => {
        document.querySelector('.stick').style.transitionTimingFunction = TTF.linear.emphasized;
        document.querySelector('.stick').classList.remove('cursor-pointer-animate');
      }, searchParams.get("loadingState") ? 0 : 2000);
      await Functions.jobDelay(() => {
        document.querySelector('.subtitle').style.transform = 'translateY(-13vh) scale(1, 0.8)';
      }, searchParams.get("loadingState") ? 0 : 2300);
      
      setSearchParams((params) => {
        params.set("animation", "done");
        return params;
      });
    })();
  }, []);

  useEffect(() => {
    let STOPFLAG = {
      intervalChecking: false,
      loop: false
    };
    function getElemProperty(prop, elem, expectedUnit, keepUnit){
      const elemSize = (() => {
        try { return Math.round(parseFloat(window.getComputedStyle(document.querySelector(elem)).getPropertyValue(prop))); } 
        catch { return 0; };
      })();
      switch(expectedUnit){
        case '%':
          const parentWidth = document.querySelector(elem).parentElement.offsetWidth;
          const parentHeight = document.querySelector(elem).parentElement.offsetHeight;
          const convertedWidth = Math.round((elemSize / parentWidth) * 100);
          const convertedHeight = Math.round((elemSize / parentHeight) * 100);
          if(keepUnit){
            if(prop === 'width') return `${convertedWidth}%`;
            else if(prop === 'height') return `${convertedHeight}%`;
          }else{
            if(prop === 'width') return convertedWidth;
            else if(prop === 'height') return convertedHeight;
          };
          break;
        default: 
          return `${elemSize}px`;
      };
    };

    async function initLoading() {
      if(
        getElemProperty('width', '.loading-screen', 'px', true) === `${window.innerWidth}px` && 
        getElemProperty('height', '.loading-screen', 'px', true) === `${window.innerHeight}px` &&
        !STOPFLAG.intervalChecking
      ){
        STOPFLAG.intervalChecking = true;
        if(!searchParams.get("loadingState")){
          for(let i = 0; i<200 && !STOPFLAG.loop; i++){
            await Functions.jobDelay(() => {
              try{
                const nextProgress = getElemProperty('width', '.progress', '%', false) + Math.floor(Math.random() * 10);
                if(nextProgress >= 100) STOPFLAG.loop = true;
                document.querySelector(".progress").style.width = `${nextProgress}%`;
              }catch(err){ console.error(err); };
            }, 500);
          };
        };
        document.querySelector(".loading-bar").style.opacity = 0;
        document.querySelector(".loading-bar").style.transform = "translateY(20vw)";
        document.querySelector(".progress").style.width = "100%";
        await Functions.jobDelay(() => document.querySelector('.continue').classList.add("blink"), 1500);
        setSearchParams((params) => {
          params.set("loadingState", "done");
          return params;
        });
      }
    }

    const intervalId = setInterval(initLoading, 100);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if(searchParams.get("loadingState")) clearInterval(intervalId);
      const quote = ["\"Hi guys, Rand here.\" How original...", "A former Roblox tutorial YouTuber", "I love you, Carisa", "Look at your closet"];
      const randomIndex = Math.floor(Math.random() * quote.length);
      setLoadingQuote(quote[randomIndex]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  async function Continue(){
    if(searchParams.get("loadingState") === "done" && searchParams.get("animation") === "done"){
      setLSOffset(100); setLSOpacity(0);
      await Functions.jobDelay(() => setSearchParams((params) => {
        params.set("loadingState", "proceeded");
        return params;
      }), 3500);
    };
  };

  return (
    <div className="page-container">
      <div className="setup">
          <BgMusicController theme />
      </div>
      <div className='screen'>
        <div className="perspective-field">
          <div className='dice' style={{
            transform: `translate3d(-${offsetX + equalizer}vw, ${offsetY}vh, 150px) rotateX(${orientX}deg) rotateY(${orientY / 2}deg) rotateZ(${orientZ}deg) scale3d(${scale}, ${scale}, ${scale})`,
            transitionDuration: '0.1s',
            transitionTimingFunction: animationStyle
          }}>
            <div className='front face' />
            <div className='back face'>
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <circle cx="30" cy="30" r="10" />
                <circle cx="70" cy="70" r="10" />
              </svg>
            </div>
            <div className='left face'>
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <circle cx="30" cy="30" r="10" />
                <circle cx="50" cy="50" r="10" />
                <circle cx="70" cy="70" r="10" />
              </svg>
            </div>
            <div className='right face'>
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <circle cx="30" cy="30" r="10" />
                <circle cx="70" cy="30" r="10" />
                <circle cx="30" cy="70" r="10" />
                <circle cx="70" cy="70" r="10" />
              </svg>

            </div>
            <div className='top face'>
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <circle cx="30" cy="30" r="10" />
                <circle cx="70" cy="30" r="10" />
                <circle cx="50" cy="50" r="10" />
                <circle cx="30" cy="70" r="10" />
                <circle cx="70" cy="70" r="10" />
              </svg>
            </div>
            <div className='bottom face'>
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="10" />
              </svg>
            </div>
          </div>
          <div className='dice-shadow' style={{ transform: `scale3d(${scale}, ${scale}, ${scale})`}}></div>
        </div>
        <div className='loading-screen theme container bg-color'>
          <div className='ls-container' style={{ transform: `translateY(${lsOffset}vh)`, opacity: `${lsOpacity}` }}>
            <div className='banner'>
              <div className='banner-container responsive'>
                <Image alt='CodingWithRand' constant={true} name="channel_logo_new.png" />
                <div className='stick responsive theme component bg-color'/>
                <h1 className='title theme text-color'>CodingWithRand</h1>
              </div>
              <div className='banner-shadow'/>
            </div>
            <label className='subtitle responsive'>Present</label>
            <div className='loading-bar'>
              <label className='theme text-color'>{loadingQuote}</label>
              <div className='loading-bar-border theme custom'>
                <div className='progress theme component bg-color' />
              </div>
            </div>
            <label className='continue theme text-color' onClick={Continue}>Click anywhere to continue...</label>
          </div>
        </div>
      </div>
    </div>
  );
};