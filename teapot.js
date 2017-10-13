'use strict';

const fs = require('fs');

try {
	require('./config.json'); // try gathering config
} catch (e) { // if error
    console.error("config.json is not set. Use the config-base file to make one");
    return setTimeout(() => {
        process.exit(1);
    }, 838);
}

const config = require('./config.json');

// SET THESE BEFORE USE
var hostName = config.hostname; // SET ME
const HTTPSopts = {
    cert: fs.readFileSync(config.pathToCertificate),
    key: fs.readFileSync(config.pathToPrivateKey)
}; // SET ME

var securePort = 443;
var generalPort = 80;

const url = require('url');
const http = require('http');
const https = require('https');
const connect = require('connect'); // import connect package
const mainApp = connect(); // initiate connect
var secondApp = connect();

function filterIPAddresses(req) {
    if (req.connection.remoteAddress && /[\w\d]*?:[\w\d]*?:ffff:[\d]*\.[\d]*\.[\d]*\.[\d]*/.test(req.connection.remoteAddress)) { // if the remoteAddress is ipv4 under ipv6 format (this does NOT check for 6to4 tunneling)
        var filteredFirstBatch = req.connection.remoteAddress.replace(/[\w\d]*?:[\w\d]*?:ffff:/g, ''); // set remoteAddress IP as IPv4, remove ::ffff:
    } else { // else
        var filteredFirstBatch = req.connection.remoteAddress; // set remoteAddress as it is before
    }

    if (req.headers['x-forwarded-for']) { // if the request has the header X-Forwarded-For
        var finalisedIPs = `${req.headers['x-forwarded-for']} or ${filteredFirstBatch}`; // make a variable with those remoteAddress and X-Forwarded-For address
    } else if (req.connection.remoteAddress) { // else
        var finalisedIPs = filteredFirstBatch; // make a variable with only remoteAddress
    } else {
        var finalisedIPs = `Unable to get IP.`;
    }
    return finalisedIPs;
}

function reportConn(type, request, customMessage) {
    if (!type || !request || !request.connection) throw new TypeError('Excuse me wtf');
    if (customMessage) return console.log(`${customMessage} from:\n${filterIPAddresses(request)}\n`);
    console.log(`Got an ${type} request from:\n${filterIPAddresses(request)}\n`);
}

mainApp.use((request, response, next) => {
    var responseData = "<html><head><title>root</title></head><body><h1>Teapot.</h1></body></html>";
    response.writeHead(418, 'still brewing', {
        'Content-Length': Buffer.byteLength(responseData),
        'Content-Type': 'text/html',
        'X-is-secure': 'true',
        'X-is-making-tea': 'true',
        'Server': 'Apache Helicopter',
    });
    response.end(responseData, 'utf-8', function () {
        reportConn('https', request);
    });
});

secondApp.use((request, response, next) => {
    var whatHasBeenGathered = url.parse(request.url, true).path;
    response.writeHead(301, 'We have moved', {
        'X-is-a-redirector': 'true',
        'Server': 'Apache Helicopter',
        'Location': `https://${hostName}${whatHasBeenGathered}`
    });
    response.end(() => {
        reportConn('http', request, 'Redirected http request');
    });
});

var mainServer = https.createServer(HTTPSopts, mainApp);
var secondaryServer = http.createServer(secondApp);

mainServer.listen(securePort, hostName, () => { // listen on target port
    console.log(`HTTPS Server running on port ${securePort}...\n`); // report back to console
});

secondaryServer.listen(generalPort, hostName, () => { // listen on target port
    console.log(`HTTP Server running on port ${generalPort}...\n`); // report back to console
});
