module.exports = {
    ok: (sender, json) => sender.status(200).json(json),
    noContent: (sender, msg=undefined) => sender.status(204).json({ success: msg || "The request has been fulfilled without response" }),
    badRequest: (sender, msg=undefined) => sender.status(400).json({ error: msg || "Something went wrong, please try again later!"}),
    unsupportContentType: (sender, msg=undefined) => sender.status(415).json({ error: msg || "Unsupported content-type!"}),
    notFound: (sender, msg=undefined) => sender.status(404).json({ error: msg || "API not found!" })
}