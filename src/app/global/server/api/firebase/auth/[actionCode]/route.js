import { NextResponse } from "next/server";
import { updateUsername, getAllUsernames, updateRegistryData, getRegistryData, createNewCustomToken } from "../../auth";

export async function POST(request, context){
    const body = await request.json();
    try {
        let data;
        switch(context.params.actionCode){
            case "uu":
                await updateUsername(body.data.username, body.data.uid);
                break;
            case "urd":
                await updateRegistryData(body.data.uid, body.data.regData);
                break;
            case "grd":
                data = await getRegistryData(body.data.uid);
                break;
            case "cnct":
                data = await createNewCustomToken(body.data.uid);
                break;
        }
        if(data) return NextResponse.json({ data: data }, { status: 200 })
        else return new Response(null, { status: 204 })
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}

export async function GET(request, context){
    let data
    try {
        switch(context.params.actionCode){
            case "gau":
                data = await getAllUsernames();
                break;
        }
        if(data) return NextResponse.json({ data: data }, { status: 200 })
        else return new Response(null, { status: 204 })
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 400 });
    }
}