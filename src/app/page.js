"use client"

import { signOut } from "@firebase/auth";
import { auth } from "@/glient/firebase";

export default function Home() {
  return (
    <>
      hello
      <button onClick={() => signOut(auth)}>Sign Out</button>
    </>
  )
}
