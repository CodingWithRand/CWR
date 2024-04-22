"use client"

import "./client.css"
import { useState, useEffect } from "react";
import { auth } from "@/glient/firebase";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, sendEmailVerification, updateProfile } from "@firebase/auth"
import { useLoadingState } from "@/glient/loading";
import Client from "@/glient/util";
import Neutral from"@/geutral/util";
import EmailVerifificationPage from "./email-verification";
import { getAllUsernames, updateRegistryData, updateUsername } from "@/gerver/apiCaller";

export default function SignUp() {
    const { Switch, AlertBox, Dynamic } = Client.Components;
    const { InputField, InputGroupField } = Dynamic;

    const [userEmail, setUserEmail] = useState("");
    const [userPass, setUserPass] = useState("");
    const [userName, setUserName] = useState("");
    const [passConfirmed, checkPass] = useState(false);

    const [inputType, setInputType] = useState("password");
    const [regFormUnDone, validate] = useState(true);

    const [signUpSuccess, setSUS] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    
    const setLoadingState = useLoadingState();

    useEffect(() => {
        if (userEmail !== "" && userPass !== "" && userName !== "" && passConfirmed) validate(false);
        else validate(true);
    }, [userEmail, userPass, userName, passConfirmed]);

    async function initiateCreatingAccountProgress(e) {
        setUserEmail(e.target.elements["e-mail"].value);
        setUserName(e.target.elements["username"].value);
        setUserPass(e.target.elements["password"].value);

        if (userEmail === "" || userPass === "" || userName === "" || !passConfirmed) return
        e.preventDefault();

        setLoadingState(true);

        try{
            const total_username_list = await getAllUsernames();
            if (total_username_list[userName]) {
                setSUS(true); setErrMsg("This username has been taken");
                setLoadingState(false)
                return;
            }
            const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPass)
            await sendEmailVerification(userCredential.user).then(() => setEmailSent(true));
            await updateProfile(userCredential.user, { displayName: userName });
            await updateUsername(userName, userCredential.user.uid);
            const ip = await Neutral.Functions.getClientIp();
            await updateRegistryData(userCredential.user.uid, {origin: window.location.origin, authenticated: true, ip: ip, date: Date()})
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            switch (errorCode) {
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
        }
        setLoadingState(false);
    }

    return (
        <>
            <h2 className="reg-t">Create an account</h2>
            <form className="reg-form" style={{ width: "80%" }} onClick={(e) => e.stopPropagation()} onSubmit={initiateCreatingAccountProgress}>
                <div className="f-c">
                    <label className="field-label">Username</label>
                    <InputField
                        id="username"
                        name="username" required errDetector
                        detectorCls="un" type="text"
                        placeholder="Your desire username here"
                        onChange={{
                            binded: true,
                            expected_condition: [0, 1],
                            run_test: (e) => {
                                const NamePattern = /^[^\_][\w\s]+[^\s\W\_]$/g;
                                if (NamePattern.test(e.target.value) && e.target.value.length > 2) return 0
                                else return 1
                            },
                            actions: [
                                (e) => { setUserName(e.target.value); },
                                (e) => { setUserName(""); }
                            ]
                        }}
                        warningMsg={["", "Name doesn't satisfy the format"]}
                        warningMsgDescription={"(At least 3 character, must be English, doesn't contain special character except \"_\", and doesn't start with \"_\")"}
                    />
                    <label className="field-label">Email</label>
                    <InputField
                        id="e-mail"
                        name="e-mail" required errDetector
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
                    <label className="field-label">Password</label>
                    <InputGroupField
                        fieldNumber={2}
                        id={["password", "pass-confirm"]}
                        name={["password", "pass-confirm"]} required={[true, true]} errDetector={[true, true]}
                        detectorCls={["pw", "pwc"]} type={[inputType, inputType]}
                        unstaticAttributes={["type"]}
                        placeholder={["Your desire password here", "Confirm the password again"]}
                        onChange={[
                            {
                                binded: true,
                                expected_condition: [0, 1],
                                run_test: (e) => {
                                    if (e.target.value.length > 7) return 0;
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
                                    if (e.target.value !== userPass) return 1;
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
                        <div className="show-pass">
                            <Switch mode="action-on-off" action={() => setInputType("text")} altAction={() => setInputType("password")} />
                            <label className="field-label">Show Password</label>
                        </div>
                    </div>
                    <button className="submit-btn" type="submit" disabled={regFormUnDone}>Create a new account</button>
                </div>
            </form>
            <AlertBox id="sign-up-alert-box" detect={signUpSuccess} messages={{
                title: "Sign up failed",
                subtitle: errMsg,
                action: "OK"
            }}
                action={() => { setSUS(false); Neutral.Functions.jobDelay(() => setErrMsg(""), 500); }} />
            <AlertBox id="email-verification-intermission" detect={emailSent}>
                <EmailVerifificationPage />
            </AlertBox>
        </>
    )
}