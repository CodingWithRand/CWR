import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';

function MyWork() {
  const [ offsetX, setOffsetX ] = useState(0);
  const [ offsetY, setOffsetY ] = useState(0);

  const [ orientX, setOrientX ] = useState(0);
  const [ orientY, setOrientY ] = useState(0);
  const [ orientZ, setOrientZ ] = useState(0);

  const [ equalizer, setEqualizer ] = useState(0);
  // const maxOffsetX = 1250;
  // const maxOffsetY = 560;

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

    // console.log(translationX, translationY)

    const newX = translationX - 30;
    const newY = translationY + 20;

    document.querySelector(".shadow").style.right = `${-newX}px`;
    document.querySelector(".shadow").style.top = `${newY}px`;
  }

  async function initial_half_parabola(timeoutId_storage, configs){
    for(let i = 0; i<configs.highestPoints; i++) {
      await new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          setOrientX((prevOrientX) => (prevOrientX + configs.spinningRate));
          setOrientY((prevOrientY) => (prevOrientY + configs.spinningRate));
          setOrientZ((prevOrientZ) => (prevOrientZ + configs.spinningRate));
          setOffsetX((prevOffsetX) => (prevOffsetX + configs.increment));
          setOffsetY((prevOffsetY) => (prevOffsetY + Math.pow(i*configs.multiplicator, 1.5)));
          updateShadow();
          resolve();
        }, configs.accelerator);
        timeoutId_storage.push(timeoutId);
      });
    }
  }

  async function end_half_parabola(timeoutId_storage, configs){
    for(let i = configs.highestPoints; i>0; i--) {
      if(i === configs.dampener) break
      await new Promise((resolve) => {
        const timeoutId = setTimeout(() => { 
          setOrientX((prevOrientX) => (prevOrientX - configs.spinningRate))
          setOrientY((prevOrientY) => (prevOrientY - configs.spinningRate))
          setOrientZ((prevOrientZ) => (prevOrientZ - configs.spinningRate))
          setOffsetX((prevOffsetX) => (prevOffsetX + configs.increment));
          setOffsetY((prevOffsetY) => (prevOffsetY - Math.pow((i-1)*configs.multiplicator, 1.5)));
          updateShadow()
          resolve();
        }, configs.accelerator);
        timeoutId_storage.push(timeoutId);
      });
    }
  }

  async function parabola_freefall(timeoutId_storage, configs) {
    await initial_half_parabola(timeoutId_storage, configs)
    await end_half_parabola(timeoutId_storage, configs)
    if(configs.end_anim){
      for(let i = 0; i<10; i++){ 
        await new Promise((resolve) => {
          const timeoutId = setTimeout(() => {updateShadow(); resolve();}, configs.accelerator)
          timeoutId_storage.push(timeoutId)
        })
      }
      setEqualizer(18)
    }
  }

  useEffect(() => {
    const timeoutIds = [];
    /* Configs -> {
      accelerator: number -> indicate how fast the animation goes, the more you input, the slower it goes
      increment: number -> indicate how far the animation go each keyframe (x axis)
      multiplicator: number -> indicate how far the animation go each keyframe (y axis)
      highestPoints: number [int] -> the highest point in y axis that the obj will reach
      dampener: number [int] -> indicate how much height obj will stop bouncing to
      spinningRate: number -> indicate the frequency of shaking
      end_anim: boolean -> indicate that it is the last keyframe
    } */
    (async () => {
      await parabola_freefall(timeoutIds, {
        accelerator: 50,
        increment: 10,
        multiplicator: 2,
        highestPoints: 10,
        spinningRate: 5,
        dampener: 9
      });
      await parabola_freefall(timeoutIds, {
        accelerator: 50,
        increment: 5,
        multiplicator: 2,
        highestPoints: 5,
        spinningRate: -50,
      });
      await parabola_freefall(timeoutIds, {
        accelerator: 70,
        increment: 2,
        multiplicator: 1.5,
        highestPoints: 4,
        spinningRate: -45,
      });
      await parabola_freefall(timeoutIds, {
        accelerator: 90,
        increment: 1,
        multiplicator: 1.25,
        highestPoints: 3,
        spinningRate: -35,
        end_anim: true
      });
    })()
    
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id))
    }
  }, [])

  return (
    <div className='screen'>
      <div className="perspective-field">
        <div className='dice' style={{
          transform: `translateZ(50px) translateX(-${offsetX + equalizer}px) translateY(${offsetY}px) rotateX(${orientX}deg) rotateY(${orientY/2}deg) rotateZ(${orientZ}deg)`,
          transitionDuration: '0.1s',
          transitionTimingFunction: TTF.easeOut.linear_out_slow_in
          }}>
          <div className='front face'>front</div>
          <div className='back face'>back</div>
          <div className='left face'>left</div>
          <div className='right face'>right</div>
          <div className='top face'>top</div>
          <div className='bottom face'>bottom</div>
          
        </div>
        <div className='shadow'>shadow</div>
      </div>
    </div>
  );
}

function App() {
  return <MyWork/>
}

export default App;
