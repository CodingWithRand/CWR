require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser")
const server = express();

const response = require("./responseStatus");
const { userExist, getUserInfo } = require("./api/roblox/main");
const { doc } = require("./api/provider/main")

server.use(bodyParser.json())

server.use((req, res, next) => {
    if(req.method === "GET"){
        if(req.is('application/json')) next();
        if(req.headers['user-agent'].includes("Mozilla") || req.headers['user-agent'].includes("Opera")){
            res.setHeader('Content-Type', 'text/html');
            res.json = (data) => res.send(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
        }else res.setHeader('Content-Type', 'application/json')
    }else if(req.method === "POST") if(!req.is('application/json')) return response.unsupportContentType(res, "Invalid content-type (Must be json only)")
    next();
})

server.get("/get/roblox/users/exist/:userKey", (req, res) => userExist(req, res))
server.get("/get/roblox/users/info/:category/:userId", (req, res) => getUserInfo(req, res))

server.post("/post/provider/cwr/doc/:mode", (req, res) => doc(req, res))

server.post("*", (req, res) => response.notFound(res))
server.get("*", (req, res) => response.notFound(res))

server.listen(process.env.PORT || 3000, async () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
    const open = await import('open');
    open.default(`http://localhost:${process.env.PORT}`);
})