"use client"

import "./page.css";
import { NavBar } from "./components/constructor-components";
import UpdateProfilePicture from "./components/account-settings/update-ppf";
import UpdateUsername from "./components/account-settings/update-username";
import UpdatePassword from "./components/account-settings/update-password";

export default function SettingPage() {

  return (
    <>
      <NavBar />
      <main className="flex items-center flex-col">
        <UpdateProfilePicture />
        <UpdateUsername />
        <UpdatePassword />
      </main>
    </>
  )
}

