"use client"

import "./client.css"
import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "@firebase/firestore"
import { auth, firestoreDatabase } from "@/glient/firebase";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, sendEmailVerification, updateProfile } from "@firebase/auth"
import { Components, Functions } from "@/glient/util";
import { useRouter } from "next/navigation"

export default function SignUp() {

    const { Switch, AlertBox, Dynamic } = Components;
    const { InputField, InputGroupField } = Dynamic;

    const username_storage = doc(firestoreDatabase, 'util', 'availableUser');

    const [userEmail, setUserEmail] = useState("");
    const [userPass, setUserPass] = useState("");
    const [userName, setUserName] = useState("");
    const [passConfirmed, checkPass] = useState(false);

    const [inputType, setInputType] = useState("password");
    const [regFormUnDone, validate] = useState(true);

    const [signUpSuccess, setSUS] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        if (userEmail !== "" && userPass !== "" && userName !== "" && passConfirmed) validate(false);
        else validate(true);
    }, [userEmail, userPass, userName, passConfirmed]);

    async function initiateCreatingAccountProgress(e) {
        if (userEmail === "" || userPass === "" || userName === "" || !passConfirmed) return
        e.preventDefault();

        const total_username_list = await getDoc(username_storage);
        if (total_username_list.data()[userName]) {
            setSUS(true); setErrMsg("This username has been taken");
            return;
        }

        createUserWithEmailAndPassword(auth, userEmail, userPass).then((userCredential) => {
            sendEmailVerification(userCredential.user).then(() => window.location.replace("/registration/verify"));
            updateProfile(userCredential.user, { displayName: userName });
            updateDoc(username_storage, { [userName]: userCredential.user.uid });
        })
            .catch((error) => {
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
            });
    }

    return (
        <>
            <h2 className="reg-t responsive">Create an account</h2>
            <form className="reg-form" style={{ width: "80%" }} onClick={(e) => e.stopPropagation()} onSubmit={initiateCreatingAccountProgress}>
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
                                if (NamePattern.test(e.target.value) && e.target.value.length > 2) return 0
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
                    <div className="option-field responsive">
                        <div className="show-pass">
                            <Switch mode="action-on-off" action={() => setInputType("text")} altAction={() => setInputType("password")} />
                            <label className="field-label responsive">Show Password</label>
                        </div>
                    </div>
                    <button className="submit-btn responsive" type="submit" disabled={regFormUnDone}>Create a new account</button>
                </div>
            </form>
            <AlertBox id="sign-up-alert-box" detect={signUpSuccess} messages={{
                title: "Sign up failed",
                subtitle: errMsg,
                action: "OK"
            }}
                action={() => { setSUS(false); Functions.jobDelay(() => setErrMsg(""), 500); }} />
        </>
    )
}