"use client"

import "./page.css";
import UpdateProfilePicture from "./components/account-settings/update-ppf";
import UpdateUsername from "./components/account-settings/update-username";
import UpdatePassword from "./components/account-settings/update-password";
import Client from "@/glient/util";
import { SignOutBTN, Username } from "./components/utility-components";
import Loading from "@/glient/loading";

export default function SettingPage() {
  const { AuthenticateGate } = Client.Components; 
  return (
    <AuthenticateGate unauthenticatedAction={() => window.location.replace("/")}>
      <Loading cover>
        <nav id="navbar">
          <ul>
              <li className="text-md sm:text-lg">Welcome!</li>
              <Username />
          </ul>
          <ul>
              <Client.Components.ThemeChanger />
              <li><Client.Components.UserPFP /></li>
              <li className="flex justify-center"><SignOutBTN /></li>
          </ul>
        </nav>
        <main className="flex items-center flex-col">
          <UpdateProfilePicture />
          <UpdateUsername />
          <UpdatePassword />
        </main>
      </Loading>
    </AuthenticateGate>
  )
}

