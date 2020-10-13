/**
 * The Server Can be configured and created here...
 *
 * You can find the JSON Data file here in the Data module. Feel free to impliment a framework if needed.
 */

const http      = require('http');
const hostname  = 'localhost';
const port      = 3035;

const {search}  = require('./controllers/search');

/**
 * Start the Node Server Here...
 *
 * The http.createServer() method creates a new server that listens at the specified port.
 * The requestListener function (function (req, res)) is executed each time the server gets a request.
 * The Request object 'req' represents the request to the server.
 * The ServerResponse object 'res' represents the writable stream back to the client.
 */
http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');

    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', async () => {
        body = Buffer.concat(body).toString();
        try {
            res.end(JSON.stringify(await search(JSON.parse(body))));
        }
        catch (e) {
            res.end("Error parsing request: " + body);
        }
    });
}).listen( port );


console.log(`[Server running on ${hostname}:${port}]`);
