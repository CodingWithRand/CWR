import Client from "@/glient/util";
import { auth } from "@/glient/firebase";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword, sendPasswordResetEmail } from "@firebase/auth";
import { useRef, useState } from "react";

const { Dynamic, Switch } = Client.Components;
const { AlertBox, Section, InputField, InputGroupField } = Dynamic

export default function UpdatePassword() {
    const [inputType, setInputType] = useState("password");
    const [passConfirmed, checkPass] = useState(true);
    const [result, debug] = useState(false);
    const [userPass, setUserPass] = useState("");
    const oldPassword = useRef();

    const [dialogMessages, setDM] = useState({
        title: "",
        subtitle: "",
        description: ""
    })

    function changePassword(e){
        e.preventDefault();
        if(passConfirmed) return;
        reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(auth.currentUser.email, oldPassword.current))
        .then(() => updatePassword(auth.currentUser, userPass).then(() => { setDM({title: "Successfully Changing your password", subtitle: "You're good to go now", description: ""}); debug(true); }))
        .catch((err) => {
            if(err.code === "auth/invalid-login-credentials") setDM({title: "Changing Password failed", subtitle: "Fail to confirm your identity", description: "You have inputted the wrong old password, please type in the correct password"})
            else setDM({title: "Changing Password failed", subtitle: "Something went wrong, please try again later", description: ""})
            debug(true);
        })
    }
    
    return(
        <Section themed style="pallete" title="Password" description="Change your password here">
            <form className="password setting-submitting-form" onSubmit={changePassword}>
                <InputField 
                    name="password" type={inputType} themed required placeholder="Your old password here"
                    onChange={{
                        binded: true,
                        expected_condition: [0],
                        run_test: (e) => 0,
                        actions: [(e) => { oldPassword.current = e.target.value; }]
                    }}
                />
                <InputGroupField 
                    fieldNumber={2} themed
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
                                (e) => { checkPass(false) },
                                (e) => { checkPass(true) }
                            ]
                        }
                    ]}
                    warningMsg={[["", "Password must contain at least 8 characters"], ["", "Password does not match!"]]}
                />

                <div className="option-field">
                    <Switch id="id1" cls="specific" mode="action-on-off" action={() => setInputType("text")} altAction={() => setInputType("password")}/>
                    <label className="field-label responsive">Show Password</label>
                    <span className="forget-password responsive" onClick={() => sendPasswordResetEmail(auth, auth.currentUser.email).then(() => {
                        debug(true);
                        setDM((prevDM) => ({...prevDM, title: "Password reset email has been sent!", subtitle: "Please check your email inbox!", description: ""}))
                    })}>Forgot your password? Reset it here</span>
                </div>
                <button className="submit-btn responsive" type="submit" disabled={passConfirmed}>Submit</button>
            </form>
            <AlertBox themed id="password-change-alert-box" detect={result} messages={{
                title: dialogMessages.title,
                subtitle: dialogMessages.subtitle,
                description: dialogMessages.description,
                action: "OK"
            }}
            action={() => {debug(false);}} />
        </Section>
    )
}