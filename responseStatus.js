module.exports = {
    ok: (sender, json) => sender.status(200).json(json),
    created: (sender, msg=undefined) => {
        let response;
        if(msg.message && msg.requireJSON && msg.responseJSON) response = { success: msg.message || "The request has been fulfilled and resulted in a new resource being created", data: msg.responseJSON };
        else response = { success: msg || "The request has been fulfilled and resulted in a new resource being created" };
        sender.status(201).json(response);
    },
    noContent: (sender, msg=undefined) => sender.status(204).json({ success: msg || "The request has been fulfilled without response" }),
    seeOther: (sender, anotherAPIUrl=undefined) => sender.status(303).json({ message: `This API is not for your request, please consider request from another one${anotherAPIUrl ? " (" + anotherAPIUrl + ")" : ""}` }),
    badRequest: (sender, msg=undefined) => sender.status(400).json({ error: msg || "Something went wrong, please try again later!"}),
    notFound: (sender, msg=undefined) => sender.status(404).json({ error: msg || "API not found!" }),
    unsupportContentType: (sender, msg=undefined) => sender.status(415).json({ error: msg || "Unsupported content-type!"}),
}