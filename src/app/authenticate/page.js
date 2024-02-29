"use client"

import Neutral from "@/geutral/util"
import Client from "@/glient/util";
import { auth } from "@/glient/firebase";
import "./page.css"
import { applyActionCode, confirmPasswordReset } from "@firebase/auth";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthenticateActionHandler() {
    const { LoadingPage } = Neutral.Components
    const { AlertBox, Dynamic, Section, Switch } = Client.Components;
    const { InputGroupField } = Dynamic;

    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    const [ authicateMethodText, setAMT] = useState("")
    const [ authenticationAlertBox, setAAB ] = useState(<></>)

    useEffect(() => {
        (async () => {
            switch(mode){
                case "verifyEmail": 
                    setAMT("Verifying your email"); 
                    try {
                        await applyActionCode(auth, oobCode);
                        setAMT("Successfully verify your email!")
                    } catch { setAMT("Fail to verify your email!") }
                    
                    break;
                case "resetPassword":
                    try {
                        await applyActionCode(auth, oobCode);
                        setAAB(ResetPasswordForm)
                    } catch {
                        setAAB("Your reset password link is not valid or has been expired")
                    }
                default: window.location.replace("/");
            }
        })
    }, []);

    function ResetPasswordForm(){

        const [passConfirmed, checkPass] = useState(true);
        const [userPass, setUserPass] = useState("");
        const [inputType, setInputType] = useState("password");

        async function changePassword(e){
            e.preventDefault();
            if(passConfirmed) return;
            try { 
                await confirmPasswordReset(auth, oobCode, userPass);
                setAAB(<>Successfully reset your password</>)
                window.location.replace("/registration");
            }
            catch { 
                setAAB(<>Fail to reset password</>)
            }
        }

        return(
            <Section themed style="pallete" title="Password" description="Change your password here">
            <form className="password setting-submitting-form" onSubmit={changePassword}>
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
                    <Switch cls="specific" mode="action-on-off" action={() => setInputType("text")} altAction={() => setInputType("password")}/>
                    <label className="field-label responsive">Show Password</label>
                </div>
                <button className="submit-btn responsive" type="submit" disabled={passConfirmed}>Submit</button>
            </form>
        </Section>
        )
    }
    

    return(
        <>
            <LoadingPage />
            <div className="authentication-action">{authicateMethodText}</div>
            <AlertBox>

            </AlertBox>
        </>
    )
}