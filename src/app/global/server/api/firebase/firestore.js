"use server"

export async function read(path){
    const dataResponse = await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: path, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
    });
    const data = await dataResponse.json();
    return data.docData;
}

export async function update(path, data){
    await fetch("https://cwr-api.onrender.com/post/provider/cwr/firestore/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: path, writeData: data, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
    })
}