"use server"

import { del, read, update } from "./firestore";

const getAllUsernames = async () => await read("util/availableUser");
const updateUsername = async (newUsername, uid, oldUsername=undefined) => {
    if(oldUsername) await del("util/availableUser", "field", oldUsername);
    await update("util/availableUser", { [newUsername]: uid });
}

const updateRegistryData = async (userId, data) => await update(`util/authenticationSessions/${userId}/Web`, {[data.origin]: { authenticated: data.authenticated, at: { place: data.ip, time: data.date } }})

const getRegistryData = async (userId) => await read(`util/authenticationSessions/${userId}/Web`);

async function createNewCustomToken(userId){
    const newTokenResponse = await fetch("https://cwr-api.onrender.com/post/provider/cwr/auth/createCustomToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userId, adminKey: process.env.FIREBASE_PERSONAL_ADMIN_KEY })
    })
    const newToken = await newTokenResponse.json();
    return newToken.data.token;
}

export { updateUsername, getAllUsernames, updateRegistryData, getRegistryData, createNewCustomToken }