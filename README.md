# secure-teapot

"I'm a teapot" over HTTPS.

Requirements
-----------
* [Node.js](https://nodejs.org/)
* A domain
* An SSL Certificate for that domain (In PEM format, aka the format that the file starts with `-----BEGIN CERTIFICATE-----` or `-----BEGIN RSA PRIVATE KEY-----`)

Dependecies
-----------
* [connect](https://www.npmjs.com/package/connect)

Installation
-----------
* Clone the repository.
* Create a file named `config.json` with the base of [config-base.json](https://github.com/linuxgemini/secure-teapot/blob/master/config-base.json) in the repository folder.

Example:		

		{
		  "hostname": "the.domain-i-have.xyz",
		  "pathToCertificate": "/path/to/certificate.pem",
		  "pathToPrivateKey": "/path/to/privatekey.pem"
		}
* Open a terminal in the repository folder.

        ~/secure-teapot$ npm install
        
Usage
-----------
* Open a terminal in the repository folder.

        ~/secure-teapot$ npm start
* Visit the domain you've set (e.g., the.domain-i-have.xyz) on your browser. Or use cURL if you really want to see the code 418.
* If you want to stop the server, just do CTRL+C and done.

End Note
-----------
I got bored enough to do this.

I got even bored to do `README.md` and `package.json`.
