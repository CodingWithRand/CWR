const express = require("express");
const path = require("path");
const React = require("react");
const { createElement } = React;
const ReactDOMServer = require("react-dom/server");

const TestSSRComponent = require("../components/test.js");

const server = express();

server.use(express.static(path.join(__dirname, "../build")));

server.get("/ssr-test", (req, res) => {
    const reactContent = ReactDOMServer.renderToString(createElement(TestSSRComponent));
    res.send(`   
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    h1, h2{ text-align: center }
                    .subtitle{ font-size: 2em }
                    .title{ font-size: 3em }
                    .description{ font-size: 1.5em }
                    .information-tile{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        row-gap: 10px;
                    }
                </style>
            </head>
            <body>
                <h2 class="subtitle">Hey guys, this is</h2>
                <h1 class="title">A React SSR component!</h1>
                <div id="react" class="information-title">${reactContent}</div>
                <script src="client-hydration/test.bundle.js" type="application/javascript"></script>
            </body>
        </html>
    `)
})

server.get("*", (req, res) => res.sendFile(path.join(__dirname, "../build", "index.html")));

server.listen(3000, () => console.log("listening at port 3000"));