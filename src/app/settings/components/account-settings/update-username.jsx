import { useState } from "react";
import Client from "@/glient/util";
import { updateProfile } from "@firebase/auth";
import { auth } from "@/glient/firebase";
import { updateUsername } from "@/gerver/apiCaller";
import Cookies from "universal-cookie";

const { InputField, Section } = Client.Components.Dynamic;

export default function UpdateUsername() {
    const [userName, setUserName] = useState("");
    const [isValid, validate] = useState()
    const cookies = new Cookies();
    async function changeDisplayName(e){
        e.preventDefault();
        if(isValid){ 
            await updateUsername(userName, auth.currentUser.uid, auth.currentUser.displayName);
            await updateProfile(auth.currentUser, { displayName: userName });
            cookies.set("username", userName, { path: "/" });
            if(window !== window.parent){
                const targetWebsite = [
                    "https://cwr-education.vercel.app",
                ];
                targetWebsite.forEach((url) => window.parent.postMessage({ action: "signalUpdateClientUsername", newUsername: userName }, url));
            }
            window.location.reload();
        }
    }
    return(
        <Section themed style="pallete" title="Display Name" description="Change your display name here">
            <form className="display-name setting-submitting-form" onSubmit={changeDisplayName}>
                <InputField 
                    name="username" required errDetector
                    detectorCls="un" type="text" themed
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
                            (e) => { 
                                validate(true);
                                setUserName(e.target.value);
                            },
                            (e) => { 
                                validate(false) 
                                setUserName("");
                            }
                        ]
                    }}
                    warningMsg={["", "Name doesn't satisfy the format (At least 3 character, must be English, doesn't contain special character except \"_\", and doesn't start with \"_\")"]}
                />
                <input className="submit-btn" type="submit" />
            </form>
        </Section>
    )
}