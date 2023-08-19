require('dotenv').config();
const listenPort = process.argv.length === 2 ? 5005 : 5305;
const hostname = 'qdrant.aimixer.io'
const privateKeyPath = `/etc/sslkeys/aimixer.io/aimixer.io.key`;
const fullchainPath = `/etc/sslkeys/aimixer.io/aimixer.io.pem`;

const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');

const qdrant = require('./utils/qdrant');

const app = express();
app.use(express.static('public'));
app.use(express.json({limit: '200mb'})); 
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const handleCreateOpenAICollection = async (req, res) => {
    let { collectionName, diskBased } = req.body;
    if (typeof diskBased === 'undefined') diskBased = false;
    console.log('collectionName', collectionName);
    const result = await qdrant.createOpenAICollection(collectionName, diskBased);
    return res.status(200).json(result);
}

const deleteCollection = async (req, res) => {
    const { collectionName } = req.body;

    const result = await qdrant.deleteCollection(collectionName);
    return res.status(200).json(result);
}


app.post('/createOpenAICollection', (req, res) => handleCreateOpenAICollection(req, res));
app.post('/deleteCollection', (req, res) => handleCreateOpenAICollection(req, res));

const httpsServer = https.createServer({
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(fullchainPath),
  }, app);
  

  httpsServer.listen(listenPort, '0.0.0.0', () => {
    console.log(`HTTPS Server running on port ${listenPort}`);
});


