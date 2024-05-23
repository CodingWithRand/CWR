"use client"

import "./page.css"
import Client from "@/glient/util";

const { NavBar, CWRFooter } = Client.Components
const { Coroussel } = Client.Components.Dynamic

export default function MyProjects() {
  return (
    <>
      <NavBar />
      <Coroussel 
        totalPages={3} 
        corousselElements={[
          <div style={{
            width: "100%",
            height: "100%",
            backdropFilter: "blur(10px)" /* Apply blur effect */
          }}>
            or4ifueijdkolp;
          </div>
        ]}
        corousselWrappersStyle={[

        ]}
      />
      <CWRFooter />
    </>
  );
}

