import "../../css/use/registration-page/index.css"
import { useEffect, useState, useRef } from "react"
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from "@firebase/auth"
import { doc, updateDoc, getDoc } from "@firebase/firestore"
import { auth, firestoreDatabase } from "../../scripts/firebase";
import { useNavigate } from "react-router-dom";
import { Components, Functions, Hooks } from "../../scripts/util";
import { useGlobal } from "../../scripts/global";

const { Switch, AlertBox, Dynamic } = Components;
const { InputField, InputGroupField } = Dynamic;

const username_storage = doc(firestoreDatabase, 'util', 'availableUser');

function SignUp() {

    const navigator = useNavigate();
    
    const [userEmail, setUserEmail]= useState("");
    const [userPass, setUserPass] = useState("");
    const [userName, setUserName] = useState("");
    const [passConfirmed, checkPass] = useState(false);

    const [inputType, setInputType] = useState("password");
    const [regFormUnDone, validate] = useState(true);

    const [signUpSuccess, setSUS] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        if(userEmail !== "" && userPass !== "" && userName !== "" && passConfirmed) validate(false);
        else validate(true);
    }, [userEmail, userPass, userName, passConfirmed]);

    async function initiateCreatingAccountProgress(e) {
        if(userEmail === "" || userPass === "" || userName === "" || !passConfirmed) return
        e.preventDefault();

        const total_username_list = await getDoc(username_storage);
        if(total_username_list.data()[userName]){
            setSUS(true); setErrMsg("This username has been taken");
            return;
        }

        createUserWithEmailAndPassword(auth, userEmail, userPass).then((userCredential) => {
            sendEmailVerification(userCredential.user).then(() => { navigator("/registration/verify"); window.location.reload(); });
            updateProfile(userCredential.user, { displayName: userName });
            updateDoc(username_storage, { [userName]: userCredential.user.uid });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            switch(errorCode){
                case "auth/email-already-in-use":
                    setSUS(true);
                    setErrMsg("The email is already in use!");
                    break;
                default:
                    setSUS(true);
                    setErrMsg("Something went wrong, please try again later");
                    console.log(errorCode, errorMessage);
                    break;
            }
        });
    }

    return(
        <>
            <h2 className="reg-t theme custom responsive">Create an account</h2>
            <form className="reg-form" onClick={(e) => e.stopPropagation()} onSubmit={initiateCreatingAccountProgress}>
                <div className="f-c">
                    <label className="field-label responsive">Username</label>
                    <InputField 
                        name="username" required errDetector
                        detectorCls="un" type="text"
                        placeholder="Your desire username here"
                        onChange={{
                            binded: true,
                            expected_condition: [0, 1],
                            run_test: (e) => {
                                const NamePattern = /^[^\_][\w\s]+[^\s\W\_]$/g;
                                if(NamePattern.test(e.target.value) && e.target.value.length > 2) return 0
                                else return 1
                            },
                            actions: [
                                (e) => { setUserName(e.target.value); },
                                (e) => { setUserName(""); }
                            ]
                        }}
                        warningMsg={["", "Name doesn't satisfy the format (At least 3 character, must be English, doesn't contain special character except \"_\", and doesn't start with \"_\")"]}
                    />
                    <label className="field-label responsive">Email</label>
                    <InputField 
                        name="email" required errDetector
                        detectorCls="em" type="email"
                        placeholder="Your email here"
                        onChange={{
                            binded: true,
                            expected_condition: [0, 1, 2],
                            run_test: async (e) => {
                                try {
                                    await fetchSignInMethodsForEmail(auth, e.target.value)
                                    return 0
                                } catch (err) {
                                    return 1 
                                }
                            },
                            actions: [
                                (e) => { setUserEmail(e.target.value); },
                                (e) => { setUserEmail(""); }
                            ]
                        }}
                        warningMsg={["", "Email is invalid!"]}
                    />
                    <label className="field-label responsive">Password</label>
                    <InputGroupField 
                        fieldNumber={2}
                        name={["password", "pass-confirm"]} required={[true, true]} errDetector={[true, true]}
                        detectorCls={["pw", "pwc"]} type={[inputType, inputType]}
                        unstaticAttributes={["type"]}
                        placeholder={["Your desire password here", "Confirm the password again"]}
                        onChange={[
                            {
                                binded: true,
                                expected_condition: [0, 1],
                                run_test: (e) => {
                                    if(e.target.value.length > 7) return 0;
                                    else return 1;
                                },
                                actions: [
                                    (e) => { setUserPass(e.target.value); },
                                    (e) => { setUserPass(""); }
                                ]
                            },
                            {
                                binded: true,
                                expected_condition: [0, 1],
                                run_test: (e) => {
                                    if(e.target.value !== userPass) return 1;
                                    else return 0;
                                },
                                actions: [
                                    (e) => { checkPass(true) },
                                    (e) => { checkPass(false) }
                                ]
                            }
                        ]}
                        warningMsg={[["", "Password must contain at least 8 characters"], ["", "Password does not match!"]]}
                    />
                    <div className="option-field">
                    <Switch mode="action-on-off" action={() => setInputType("text")} altAction={() => setInputType("password")}/>
                        <label className="field-label responsive">Show Password</label>
                    </div>
                    <button className="submit-btn responsive" type="submit" disabled={regFormUnDone}>Create a new account</button>
                </div>
            </form>
            <AlertBox id="sign-up-alert-box" detect={signUpSuccess} messages={{
                title: "Sign up failed",
                subtitle: errMsg,
                action: "OK"
            }}
            action={() => {setSUS(false); Functions.jobDelay(() => setErrMsg(""), 500);}} />
        </>   
    )
}

function SignIn() {

    const { login } = useGlobal();

    const userEmail = useRef("");
    const userPass = useRef("");
    const userName = useRef("");

    const [inputType, setInputType] = useState("password");
    const [result, debug] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigator = useNavigate();

    function initiateSignInProgress(e){
        e.preventDefault();
        
        signInWithEmailAndPassword(auth, userEmail.current, userPass.current).then((userCredential) => {
            const user = userCredential.user;
            const username = user.displayName;
            if(username === userName.current){
                login.logIn(true);
                navigator("/");
                window.location.reload();
            }else{
                debug(true);
                setErrMsg("Invalid username");
                signOut(auth);
            }
        }).catch((error) => {
            if(error.code === "auth/invalid-login-credentials"){ debug(true); setErrMsg("Email or password is incorrect!");}
            else{ debug(true); setErrMsg("Something went wrong, please try again later");};
        })
    };

    function onFormUpdate(e, refValue) {
        e.preventDefault();
        refValue.current = e.target.value;
    };

    return(
        <>
            <h2 className="reg-t theme custom responsive">Sign In</h2>
            <form className="reg-form" onClick={(e) => e.stopPropagation()} onSubmit={initiateSignInProgress}>
                <div className="f-c">
                    <label className="field-label responsive">Username</label>
                    <InputField 
                        name="user" type="text" required 
                        onChange={{
                            binded: true,
                            expected_condition: [0],
                            run_test: (e) => 0,
                            actions: [(e) => onFormUpdate(e, userName)]
                        }}
                    />
                    <label className="field-label responsive">Email</label>
                    <InputField 
                        name="email" type="email" required 
                        onChange={{
                            binded: true,
                            expected_condition: [0],
                            run_test: (e) => 0,
                            actions: [(e) => onFormUpdate(e, userEmail)]
                        }}
                    />
                    <label className="field-label responsive">Password</label>
                    <InputField 
                        name="password" type={inputType} required 
                        onChange={{
                            binded: true,
                            expected_condition: [0],
                            run_test: (e) => 0,
                            actions: [(e) => onFormUpdate(e, userPass)]
                        }}
                    />
                    <div className="option-field">
                        <Switch mode="action-on-off" action={() => setInputType("text")} altAction={() => setInputType("password")}/>
                        <label className="field-label responsive">Show Password</label>
                    </div>
                    <button className="submit-btn responsive" type="submit">Sign In</button>
                </div>
            </form>
            <AlertBox id="sign-in-alert-box" detect={result} messages={{
                title: "Sign in failed",
                subtitle: errMsg,
                action: "OK"
            }}
            action={() => {debug(false); Functions.jobDelay(() => setErrMsg(""), 500);}} />
        </>
    )
}

export default function RegistrationPage(){
    const navigator = useNavigate();
    const { login, exceptionPage } = useGlobal();
    const [isFillingForm , setFillingForm] = useState({undefined: false});

    async function initiateFillingFormProgress(section) {
        if(Object.keys(isFillingForm)[0] !== section && Object.values(isFillingForm)[0] && Object.keys(isFillingForm)[0] !== "undefined") return;
        if(isFillingForm[section]) {
            const formField = document.querySelector(`#${section} > .reg-form`);
            document.querySelector(`#${section}`).classList.add("hov-eff");
            formField.classList.remove("rev");
            await Functions.jobDelay(() => formField.classList.remove("animate", "exp"), 300);
            setFillingForm({undefined: false});
        } else {
            const formField = document.querySelector(`#${section} > .reg-form`);
            document.querySelector(`#${section}.hov-eff`).classList.remove("hov-eff");
            formField.classList.add("animate", "exp");
            await Functions.jobDelay(() => formField.classList.add("rev"), 300);
            setFillingForm({[section]: true});
        };  
    };

    Hooks.useDelayedEffect(() => {
        if(login.isLoggedIn && auth.currentUser?.emailVerified){ navigator("/"); window.location.reload(); };
    }, [login.isLoggedIn], 100);

    useEffect(() => {
        (async () => {
            await Functions.jobDelay(() => {
                try { document.querySelector('.h-reg').classList.add("animate"); }
                catch (error) { console.error(error); };
            }, 400)
            await Functions.jobDelay(() => {
                try { document.querySelector('.registration-forms').classList.add("animate"); }
                catch (error) { console.error(error) };
            }, 1000);
        })();
    }, []);

    useEffect(() => { exceptionPage.setOnExceptionPage(true) }, [])

    return(
        <div className="page-container">
            <h1 className="theme text-color h-reg responsive">Please let me know who you are</h1>
            <ul className="registration-forms">
                <li id="sign-in" className="reg-f hov-eff theme custom responsive font-barlow" onClick={() => {
                    initiateFillingFormProgress("sign-in");
                }}>
                    <SignIn />
                </li>
                <li className="theme custom text-color reg-t reg-t-or responsive">Or</li>
                <li id="sign-up" className="reg-f hov-eff theme custom responsive font-barlow" onClick={() => {
                    initiateFillingFormProgress("sign-up");
                }}>
                    <SignUp />
                </li>
            </ul>
        </div>
    );
};