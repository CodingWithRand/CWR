import { useEffect, useState, useRef } from "react";
import { useGlobal } from "./global";
import "@/gss/util.css";
import "@/gss/theme.css";
import "@/gss/responsive.css";

async function asyncDelay(ms) { return new Promise((resolve) => setTimeout(() => resolve(), ms)); };
async function jobDelay(callback, ms){
    let timeoutId;
    await new Promise((resolve) => {
        timeoutId = setTimeout(() => {
            callback();
            resolve();
        }, ms);
    });
    clearTimeout(timeoutId);
};

function syncDelay(ms) {
    const start = Date.now();
    let now = start;
    while (now - start < ms) {
        now = Date.now();
    };
};

function useDelayedEffect(callback, dependencies, delay) {
    const savedCallback = useRef();
  
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    useEffect(() => {
      function tick() {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }
  
      const timerId = setTimeout(tick, delay);
  
      return () => clearTimeout(timerId);
    }, [...dependencies, delay]);
}
  
function Image(props){
    const { theme } = useGlobal();
    const [imgSrc, setImgSrc] = useState("");
    const [isBinding, bind] = useState(false);
    
    useEffect(() => {
        if(isBinding) return;
        if(!props.constant) setImgSrc(process.env.PUBLIC_URL + `/imgs/backend-images/theme/${props.dir || ""}${(() => {
                if(theme.theme === "default-os" && props.name !== "mode.png"){
                    if(window.matchMedia('(prefers-color-scheme: dark)').matches) return "dark";
                    else return "light";
                }else return theme.theme
            })()}-${props.name}`);
        else setImgSrc(process.env.PUBLIC_URL + `/imgs/backend-images/${props.dir || ""}${props.name}`);
    }, [theme.theme, isBinding]);

    Hooks.useDelayedEffect(() => {
        const targetElement = document.querySelector(`#${props.to}[binding-status]`);
      
        if (targetElement) {
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === 'attributes' && mutation.attributeName === 'binding-status') {
                if(targetElement.getAttribute('binding-status') === "true"){
                    bind(true);
                    setImgSrc(process.env.PUBLIC_URL + `/imgs/backend-images/binded/${props.dir || ""}binded-${props.name}`);
                }
                else if(targetElement.getAttribute('binding-status') === "false"){
                    bind(false);
                    setImgSrc(process.env.PUBLIC_URL + `/imgs/backend-images/theme/${props.dir || ""}${(() => {
                        if(theme.theme === "default-os" && props.name !== "mode.png"){
                            if(window.matchMedia('(prefers-color-scheme: dark)').matches) return "dark";
                            else return "light";
                        }else return theme.theme
                    })()}-${props.name}`);
                }
              }
            }
          });
      
          observer.observe(targetElement, { attributes: true });

          return () => observer.disconnect();

        }
      }, [], 100);
    
    return <img alt={props.alt} src={imgSrc} className={props.cls || ""} />;
};

function AlertBox(props){
    const [timer, setTimer] = useState(props.auto === true ? 3 : "");

    useEffect(() => {
        if(props.auto){
            if(props.detect) Functions.jobDelay(() => {
                if(timer > 0) setTimer(prevT => {return prevT - 1});
                else{ setTimer(0); props.action(); }
            }, 1000);
        }
    }, [props.detect, timer])

    useDelayedEffect(() => {
        if(props.detect) document.getElementById(props.id).showModal();
        else document.getElementById(props.id).close();
    }, [props.detect], 500);

    return (
        <dialog id={props.id} className={`alert-box responsive ${props.themed ? "theme" : ""} container bg-color border-color`}>
            <div className="dialog-nester responsive">
                <h2 className={`dialog-title ${props.themed ? "theme" : ""} text-color responsive`}>{props.messages.title}</h2>
                <label className={`dialog-subtitle responsive ${props.themed ? "theme" : ""} text-color`}>{props.messages.subtitle || ""}</label>
                <div className={`dialog-description responsive ${props.themed ? "theme" : ""} text-color`}>{props.messages.description || ""}</div>
                <button className="dialog-btn responsive" onClick={props.action}>{`${props.messages.action} ${timer}`}</button>
            </div>
        </dialog>
    );
};

function Switch(props){
    const [switchState, turn] = useState(false);
    
    const [switchStateClass, setSSC] = useState("is-off");
    const [delayStateClass, setDSC] = useState("is-off");

    useEffect(() => {
        switch(props.mode){
            case "action-on":
                if(switchState) props.action();
                break;
            case "action-off":
                if(!switchState) props.action();
                break;
            case "action-on-off":
                if(!props.altAction) throw new Error("altAction prop is missing")
                else{
                    if(switchState) props.action();
                    else props.altAction();
                };
                break;
            default:
                throw new Error("Unknown mode") ;
        };
        
    }, [switchState]);

    return(
        <div id={props.id} className={`switch-area responsive ${props.cls || ""} ${delayStateClass}`} onClick={() => { 
            setSSC(prevState => {return prevState === "is-off" ? "is-on" : "is-off";});
            Functions.jobDelay(() => setDSC(prevState => {return prevState === "is-off" ? "is-on" : "is-off";}), 200);
            turn(prevState => {return prevState === false ? true : false});
        }}>
            <div className={`button responsive ${switchStateClass}`}></div>
        </div>
    );
};

function Section(props){
    switch(props.style){
        case "pallete":
            return( 
                <div className={`pallete ${props.themed ? "theme" : ""} container bg-color intense`}>
                    <h1 className={`setting-section-title responsive ${props.themed ? "theme" : ""} text-color`}>{props.title}</h1>
                    <p className={`setting-section-description responsive ${props.themed ? "theme" : ""} text-color`}>{props.description || ""}</p>
                    {props.children}
                </div>
            );
        default:
            return <></>;
    };
};

function InputField(props){

    const [errText, setErrText] = useState("");

    useEffect(() => {
        if(!props.errDetector) return;
        if(errText !== "") {
            document.querySelector(`.${props.detectorCls}.err-detector`).classList.add("err-warn");
            document.querySelector(`.${props.detectorCls}.err-detector`).classList.remove("border-color");
        } else {
            document.querySelector(`.${props.detectorCls}.err-detector`).classList.remove("err-warn");
            document.querySelector(`.${props.detectorCls}.err-detector`).classList.add("border-color");
        };
    }, [errText]);

    return( 
        <div className="input-field">
            <input name={props.name} required={props.required} className={`${props.themed ? "theme" : ""} border-color component text-color bg-color inverse ${props.errDetector ? "err-detector" : ""} ${props.detectorCls || ""} responsive`} type={props.type} placeholder={props.placeholder || ""} onChange={(e) => {
                e.preventDefault();
                if(!props.onChange.binded) return;
                props.onChange.expected_condition.forEach((i, c) => {
                    (async () => {
                        let condition;
                        try {
                            const res = await props.onChange.run_test(e);
                            condition = res;
                        } catch {
                            condition = props.onChange.run_test(e);
                        };
                        if(condition === c){ 
                            if(props.errDetector) setErrText(props.warningMsg[i]);
                            props.onChange.actions[i](e);
                        };
                    })()
                })
                
            }}/>
            <label className="field-warning responsive">{errText}</label>
        </div>
    );
};

function InputGroupField(props){
    const [inputFields, updateInputFields] = useState(Array.from({ length: props.fieldNumber }, (_, i) => (
        <div key={i} className="sub input-field">
            <input name={props.name[i]} required={props.required[i]} className={`${props.themed ? "theme" : ""} border-color component text-color bg-color inverse ${props.errDetector[i] ? "err-detector" : ""} ${props.detectorCls[i] || ""} responsive`} type={props.type[i]} placeholder={props.placeholder[i] || ""} onChange={(e) => {
                e.preventDefault();
                if(!props.onChange[i].binded) return;
                props.onChange[i].expected_condition.forEach((j, c) => {
                    if(props.onChange[i].run_test(e) === c){ 
                        if(props.errDetector[i]) setErrText((prevErrTexts) => ({
                            ...prevErrTexts,
                            [props.detectorCls[i]]: props.warningMsg[i][j]
                        }));
                        props.onChange[i].actions[j](e);
                    }
                })
                
            }}/>
            <label className={`field-warning ${props.detectorCls[i]} responsive`}></label>
        </div>
    )));
    const [errText, setErrText] = useState((() => 
        props.detectorCls.reduce((obj, key) => {
            obj[key] = "";
            return obj;
        }, {})
    )());

    useEffect(() => {
        if(!props.errDetector || !document.querySelector(`.${props.detectorCls}.err-detector`)) return;
        props.detectorCls.forEach((dc) => {
            if(errText[dc] !== "") {
                document.querySelector(`.${dc}.err-detector`).classList.add("err-warn");
                document.querySelector(`.${dc}.err-detector`).classList.remove("border-color");
                document.querySelector(`.${dc}.field-warning`).innerHTML = errText[dc];
            } else {
                document.querySelector(`.${dc}.err-detector`).classList.remove("err-warn");
                document.querySelector(`.${dc}.err-detector`).classList.add("border-color");
                document.querySelector(`.${dc}.field-warning`).innerHTML = "";
            };
        });
    }, [errText]);

    useEffect(() => {
        updateInputFields((prevInputFields) => {
            const updatingInputFields = [...prevInputFields];
            return updatingInputFields.map((_, i) => (
                <div key={i} className="sub input-field">
                    <input name={props.name[i]} required={props.required[i]} className={`${props.themed ? "theme" : ""} border-color component text-color bg-color inverse ${props.errDetector[i] ? "err-detector" : ""} ${props.detectorCls[i] || ""} responsive`} type={props.type[i]} placeholder={props.placeholder[i] || ""} onChange={(e) => {
                        e.preventDefault();
                        if(!props.onChange[i].binded) return;
                        props.onChange[i].expected_condition.forEach((j, c) => {
                            if(props.onChange[i].run_test(e) === c){ 
                                if(props.errDetector[i]) setErrText((prevErrTexts) => ({
                                    ...prevErrTexts,
                                    [props.detectorCls[i]]: props.warningMsg[i][j]
                                }));
                                props.onChange[i].actions[j](e);
                            }
                        })
                        
                    }}/>
                    <label className={`field-warning ${props.detectorCls[i]} responsive`}></label>
                </div>
            ))
        })
    }, (() => {
        let dependencies = [];
        props.unstaticAttributes.forEach((attribute) => {
            switch(attribute){
                case "type":
                    dependencies.push(props.type);
                    break;
            }
        })
        return dependencies;
    })())

    return <div className="input-fields">{inputFields}</div>
}

function LoadingPage() {
    return(
        <div className="loading-bar">
            <div className="loading-dot" id="d1"></div>
            <div className="loading-dot" id="d2"></div>
            <div className="loading-dot" id="d3"></div>
        </div>
    )
}

const Functions = {
    asyncDelay,
    jobDelay,
    syncDelay,
};

const Components = {
    Dynamic: {
        InputField,
        InputGroupField,
        Image,
    },
    AlertBox,
    Switch,
    Section,
    LoadingPage
};

const Hooks = {
    useDelayedEffect
}

export { Functions, Components, Hooks };