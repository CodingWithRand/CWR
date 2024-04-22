"use client"

import "./page.css";
import UpdateProfilePicture from "./components/account-settings/update-ppf";
import UpdateUsername from "./components/account-settings/update-username";
import UpdatePassword from "./components/account-settings/update-password";
import Client from "@/glient/util";
import { SignOutBTN, Username } from "./components/utility-components";
import Loading from "@/glient/loading";
import { auth } from "@/glient/firebase";
import { signInWithCustomToken } from "firebase/auth";
import AuthenticationManagementPanel from "./components/account-settings/authentication-management-panel";
import { getAllUsernames, getRegistryData, createNewCustomToken } from "@/gerver/apiCaller"; 
import { useGlobal } from "@/glient/global";

export default function SettingPage() {
  const { AuthenticateGate } = Client.Components; 
  const { authUser } = useGlobal();

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
              if(event.data.parentWindowTheme === "dark" || event.data.parentWindowTheme === "default-os") document.documentElement.classList.add("dark");
              const users = await getAllUsernames();
              const userId = users[event.data.username];
              const userAuthenticatedStates = await getRegistryData(userId);
              const thisSiteStates = userAuthenticatedStates[window.location.origin];
              if(thisSiteStates.authenticated){
                const newToken = await createNewCustomToken(userId);
                await signInWithCustomToken(auth, newToken);
              }
            }else if(event.data.action === "resetFirebaseAuth") indexedDB.deleteDatabase("firebaseLocalStorageDb");
          }
        })
        targetWebsite.forEach((url) => window.parent.postMessage({ status: "ready", message: "Message Event Listener is ready!"}, url));
      }
    }}
    isolateAction={async () => {
        if(!authUser.isAuthUser) return;
        const userAuthenticatedStates = await getRegistryData(auth.currentUser.uid);
        const thisSiteStates = userAuthenticatedStates[window.location.origin];
        if(!thisSiteStates.authenticated) signOut(auth);
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
          <AuthenticationManagementPanel />
        </main>
      </Loading>
    </AuthenticateGate>
  )
}

