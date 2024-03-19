"use client"

import Client from "@/glient/util";
import Neutral from "@/geutral/util";
import { Username, SignOutBTN } from "./utility-components";
import { useGlobal } from "@/glient/global";

export function NavBar(){
    const { authUser } = useGlobal();
    return (
        <Client.Components.SuspenseComponent condition={authUser.isAuthUser} loadingComponent={<Neutral.Components.LoadingPage />}>
            <nav id="navbar">
                <ul>
                    <li className="text-lg">Welcome!</li>
                    <Username />
                </ul>
                <ul>
                    <Client.Components.ThemeChanger />
                    <li><Client.Components.UserPFP /></li>
                    <li><SignOutBTN /></li>
                </ul>
            </nav>
        </Client.Components.SuspenseComponent>
    )
}