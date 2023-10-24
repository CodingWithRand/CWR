import "../../css/use/registration-page/index.css"
import { useEffect, useState, useRef } from "react"
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth"
import { addDoc, collection, getDocs } from "firebase/firestore";
import { auth, firestoreDatabase } from "../../scripts/firebase";
import { useNavigate } from "react-router-dom";
import { Functions } from "../../scripts/util";
import { useGlobal } from "../../scripts/global";

function SignUp() {

    const navigator = useNavigate();
    
    const userEmail = useRef("");
    const userPass = useRef("");
    const userName = useRef("");

    const [regFormUnDone, validate] = useState(true);

    const [errText, setErrText] = useState({
        password: {
            length: '',
            match: ''
        },
        user: '',
        email: ''
    });

    useEffect(() => {
        if(userEmail.current !== "" && userPass.current !== "" && userName.current !== "" && errText.password.match === "") validate(false);
        else validate(true);
    }, [userEmail.current, userPass.current, userName.current, errText.password.match]);

    useEffect(() => {
        if(errText.user !== "") {
            document.querySelector(".un.err-detector").classList.add("err-warn");
            document.querySelector(".un.err-detector").classList.remove("border-color");
        } else {
            document.querySelector(".un.err-detector").classList.remove("err-warn");
            document.querySelector(".un.err-detector").classList.add("border-color");
        };
        if(errText.password.length !== "") {
            document.querySelector(".pw.err-detector").classList.remove("border-color");
            document.querySelector(".pw.err-detector").classList.add("err-warn");
        } else {
            document.querySelector(".pw.err-detector").classList.add("border-color");
            document.querySelector(".pw.err-detector").classList.remove("err-warn");
        };
        if(errText.password.match !== "") {
            document.querySelector(".pwc.err-detector").classList.remove("border-color");
            document.querySelector(".pwc.err-detector").classList.add("err-warn");
        } else {
            document.querySelector(".pwc.err-detector").classList.add("border-color");
            document.querySelector(".pwc.err-detector").classList.remove("err-warn");
        };
        if(errText.email !== "") {
            document.querySelector(".em.err-detector").classList.add("err-warn");
            document.querySelector(".em.err-detector").classList.remove("border-color");
        } else {
            document.querySelector(".em.err-detector").classList.remove("err-warn");
            document.querySelector(".em.err-detector").classList.add("border-color");
        };
    }, [errText]);

    function initiateCreatingAccountProgress(e) {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, userEmail.current, userPass.current).then(() => {
            sendEmailVerification(auth.currentUser).then(() => navigator("/registration/verify"));
            addDoc(collection(firestoreDatabase, "userData"), {
                uid: auth.currentUser.uid,
                name: userName.current
            }).then((doc) => console.log("saved username", doc)).catch((error) => console.error(error));
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    }

    return(
        <>
            <h2 className="reg-t theme custom responsive">Create an account</h2>
            <form className="reg-form" onClick={(e) => e.stopPropagation()} onSubmit={initiateCreatingAccountProgress}>
                <div className="f-c">
                    <label className="field-label responsive">Username</label>
                    <div className="input-field">
                        <input name="username" required className="theme border-color component text-color bg-color inverse err-detector un responsive" type="text" placeholder="Your desire username here" onChange={(e) => {
                            e.preventDefault();
                            const NamePattern = /^[^\_][\w\s]+[^\s\W\_]$/g;
                            if(NamePattern.test(e.target.value) && e.target.value.length > 2){ 
                                setErrText((prevErr) => ({...prevErr, user: ""}))
                                userName.current = e.target.value;
                            }
                            else{
                                userName.current = "";
                                setErrText((prevErr) => ({...prevErr, user: "Name doesn't satisfy the format (At least 3 character, must be English, doesn't contain special character except \"_\", and doesn't start with \"_\")"}));
                            }
                        }}/>
                        <label className="field-warning responsive">{errText.user}</label>
                    </div>
                    <label className="field-label responsive">Email</label>
                    <div className="input-field">
                        <input name="email" required className="theme border-color component text-color bg-color inverse err-detector em responsive" type="email" placeholder="Your email here" onChange={(e) => {
                            e.preventDefault();
                            fetchSignInMethodsForEmail(auth, e.target.value).then((methods) => {
                                if (methods.length > 0) {
                                    setErrText((prevErr) => ({...prevErr, email: "Email has been used!"}))
                                } else {
                                    userEmail.current = e.target.value;
                                    setErrText((prevErr) => ({...prevErr, email: ""}));
                                }
                            })
                            .catch(() => {
                                userEmail.current = ""
                                setErrText((prevErr) => ({...prevErr, email: "Email is invalid!"}))
                            });
                        }}/>
                        <label className="field-warning responsive">{errText.email}</label>
                    </div>
                    <label className="field-label responsive">Password</label>
                    <div className="input-field">
                        <input name="password" required className="theme border-color component text-color bg-color inverse err-detector pw responsive" type="password" placeholder="Your desire password here" onChange={(e) => {
                            e.preventDefault();
                            if(e.target.value.length > 7){
                                userPass.current = e.target.value;
                                setErrText((prevErr) => ({...prevErr, password: { ...prevErr.password, length: "" }}));
                            }
                            else{
                                userPass.current = "";
                                setErrText((prevErr) => ({...prevErr, password: { ...prevErr.password, length: "Password must contain at least 8 characters" }}));
                            }
                            if(e.target.value !== document.querySelector(".pass-confirm").value) setErrText((prevErr) => ({...prevErr, password: { ...prevErr.password, match: "Password does not match!" }}));
                            else setErrText((prevErr) => ({...prevErr, password: { ...prevErr.password, match: "" }}));
                        }}/>
                        <label className="field-warning responsive">{errText.password.length}</label>
                        <input required className="pass-confirm theme border-color component text-color bg-color inverse err-detector pwc responsive" type="password" placeholder="Confirm the password again" onChange={(e) => {
                            e.preventDefault();
                            if (e.target.value !== userPass.current) setErrText((prevErr) => ({...prevErr, password: { ...prevErr.password, match: "Password does not match!" }}));
                            else setErrText((prevErr) => ({...prevErr, password: { ...prevErr.password, match: "" }}));
                        }}/>
                        <label className="field-warning responsive">{errText.password.match}</label>
                    </div>
                    <button className="submit-btn responsive" type="submit" disabled={regFormUnDone}>Create a new account</button>
                </div>
            </form>
        </>   
    )
}

function SignIn() {

    const [{}, {logIn}] = useGlobal();

    const userEmail = useRef("");
    const userPass = useRef("");
    const userName = useRef("");

    const navigator = useNavigate();

    function initiateSignInProgress(e){
        e.preventDefault();
        getDocs(collection(firestoreDatabase, "userData")).then((snapshot) => {
            let docData;
            snapshot.forEach((doc) => docData = doc.data());
            console.log(docData.name, userName.current);
            if(docData.name === userName.current) signInWithEmailAndPassword(auth, userEmail.current, userPass.current)
            .then(() => { logIn(true); navigator("/") }).catch((error) => console.error("Error to sign in:", error));
        });
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
                    <div className="input-field">
                        <input name="user" type="text" required className="theme border-color component text-color bg-color inverse responsive" onChange={(e) => onFormUpdate(e, userName)} />
                    </div>
                    <label className="field-label responsive">Email</label>
                    <div className="input-field">
                        <input name="email" type="email" required className="theme border-color component text-color bg-color inverse responsive" onChange={(e) => onFormUpdate(e, userEmail)} />
                    </div>
                    <label className="field-label responsive">Password</label>
                    <div className="input-field">
                        <input name="password" type="password" required className="theme border-color component text-color bg-color inverse responsive" onChange={(e) => onFormUpdate(e, userPass)} />
                    </div>
                    <button className="submit-btn responsive" type="submit">Sign In</button>
                </div>
            </form>
        </>
    )
}

export default function RegistrationPage(){
    const navigator = useNavigate();
    const [{}, {isLoggedIn}] = useGlobal();
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

    useEffect(() => {
        if(isLoggedIn) navigator("/");
    }, [isLoggedIn]);

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

    return(
        <div className="page-container">
            <h1 className="theme text-color h-reg responsive">Please let's us know who you are</h1>
            <ul className="registration-forms">
                <li id="sign-in" className="reg-f hov-eff theme custom responsive" onClick={() => {
                    initiateFillingFormProgress("sign-in");
                }}>
                    <SignIn />
                </li>
                <li className="theme custom text-color reg-t reg-t-or responsive">Or</li>
                <li id="sign-up" className="reg-f hov-eff theme custom responsive" onClick={() => {
                    initiateFillingFormProgress("sign-up");
                }}>
                    <SignUp />
                </li>
            </ul>
        </div>
    );
};