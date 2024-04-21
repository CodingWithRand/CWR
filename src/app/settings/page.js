"use client"

import "./page.css";
import UpdateProfilePicture from "./components/account-settings/update-ppf";
import UpdateUsername from "./components/account-settings/update-username";
import UpdatePassword from "./components/account-settings/update-password";
import Client from "@/glient/util";
import { SignOutBTN, Username } from "./components/utility-components";
import Loading from "@/glient/loading";
import { auth } from "../global/client/firebase";
import { signInWithCustomToken } from "firebase/auth";
import Neutral from "../global/neutral/util";

export default function SettingPage() {
  const { AuthenticateGate } = Client.Components; 

  return (
    <AuthenticateGate unauthenticatedAction={() => {
      if(window === window.parent) window.location.replace("/");
      else{
        const targetWebsite = [
          "https://cwr-education.vercel.app",
        ];
        window.addEventListener("message", async (event) => {
          if(targetWebsite.some(url => url === event.origin)){
            if(event.data.action === "signalAuthenticate" && event.data.username){
              console.log("reauthenticate", event.data.parentWindowTheme);
              if(event.data.parentWindowTheme === "dark" || event.data.parentWindowTheme === "default-os") document.documentElement.classList.add("dark");
              const usersResponse= await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ path: "util/availableUser", adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
              });
              const users = await usersResponse.json();
              const userId = users.docData[event.data.username];
              const userAuthenticatedStatesResponse= await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ path: `util/authenticationSessions/${userId}/Web`, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
              });
              const userAuthenticatedStates = await userAuthenticatedStatesResponse.json();
              const thisSiteStates = userAuthenticatedStates.docData[window.location.origin];
              if(thisSiteStates.authenticated){
                const newToken = await Neutral.Functions.createNewCustomToken(userId);
                await signInWithCustomToken(auth, newToken);
              }
            }else if(event.data.action === "resetFirebaseAuth") indexedDB.deleteDatabase("firebaseLocalStorageDb");
          }
        })
        targetWebsite.forEach((url) => window.parent.postMessage({ status: "ready", message: "Message Event Listener is ready!"}, url));
      }
    }}>
      <Loading cover>
        <nav id="navbar">
          <ul>
              <li className="text-md sm:text-lg">Welcome!</li>
              <Username />
          </ul>
          <ul>
              <Client.Components.PreventCrossSiteComponent>
                <Client.Components.ThemeChanger />
              </Client.Components.PreventCrossSiteComponent>
              <li><Client.Components.UserPFP /></li>
              <Client.Components.PreventCrossSiteComponent>
                <li className="flex justify-center"><SignOutBTN /></li>
              </Client.Components.PreventCrossSiteComponent>
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

