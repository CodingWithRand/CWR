import "../css/use/theme.css"
import "../css/use/registry.css"
import { useEffect } from "react"

export default function Registry(){
    

    useEffect(() => {
        (async () => {
            await new Promise((resolve) => {
                setTimeout(() => {
                    document.querySelector('.h-reg').classList.add("animate");
                    resolve();
                }, 400);
            });
            await new Promise((resolve) => {
                setTimeout(() => {
                    document.querySelector('.registration-forms').classList.add("animate");
                    resolve();
                }, 1000);
            });
        })();
    }, []);
    return(
        <div className="reg-container">
            <h1 className="theme text-color h-reg">Please let's us know who you are</h1>
            <ul className="registration-forms">
                <li className="log-in hov-eff" onClick={() => {document.querySelector(".log-in > .reg-form").classList.add("animate")}}>
                    <h2 className="reg-t">Sign In</h2>
                    <form className="reg-form">
                        dsf
                    </form>
                </li>
                <li className="theme text-color reg-t reg-t-or">Or</li>
                <li className="sign-up hov-eff">
                    <h2 className="reg-t">Create an account</h2>
                    <form>

                    </form>
                </li>
            </ul>
        </div>
    );
};