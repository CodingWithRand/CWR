"use server"

export async function read(path){
    const dataResponse = await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: path, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
    });
    const data = await dataResponse.json();
    return data.docData;
}

export async function update(path, data){
    const updateResponse = await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: path, writeData: data, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
    })
    if(updateResponse.status === 404){
        const [ collection, document ] = path.split("/").slice(-2);
        const parentPath = path.split("/").slice(0, -2).join("/");
        await create(parentPath, collection, document, data);
    }
}

export async function create(path, collection, document, data){
    await fetch("https://cwr-api-us.onrender.com/post/provider/cwr/firestore/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: path, collectionName: collection, docName: document, writeData: data, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
    })
}

export async function del(path, action, fieldKey=undefined, cleanDelete=false){
    let postBody = action === "field" ? { path: path, fieldKey: fieldKey } : { path: path };
    await fetch(`https://cwr-api-us.onrender.com/post/provider/cwr/firestore/delete?deleteAction=${action}&cleanDeletion=${cleanDelete}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...postBody, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
    })
}