const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

const mongoURI = "mongodb+srv://nicolasbabybrawl:QDRGrf8sq2OMtCKH@babybrawl.aod6irz.mongodb.net/?retryWrites=true&w=majority&appName=Babybrawl";
const client = new MongoClient(mongoURI, { useUnifiedTopology: true });

// 1. CSP & CORS
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "frame-src 'self' https://e-player-stream.app https://drive.google.com https://kettledroopingcontinuation.com;" +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://kit.fontawesome.com http://www.topcreativeformat.com https://www.topcreativeformat.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://ka-f.fontawesome.com; " +
        "font-src 'self' https://fonts.gstatic.com https://ka-f.fontawesome.com; " +
        "img-src 'self' data: http: https:; " +
        "connect-src 'self' https://ka-f.fontawesome.com;"
    );
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
const rootDir = path.join(__dirname, '.');

app.use(express.static(path.join(rootDir, '../')));

app.use('/js', express.static(path.join(rootDir, 'js')));

// 3. ROUTES
app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, '../', 'index.html'));
});

app.get('/api/movies', async (req, res) => {
    try {
        const database = client.db("Films_dataBase");
        const collection = database.collection("Films");
        const movies = await collection.find({}).toArray();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: "Erreur DB" });
    }
});

async function startServer() {
    try {
        await client.connect();
        console.log("Connecté avec succès à MongoDB.");
        app.listen(port, () => {
            console.log(`Serveur : http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Erreur :", error);
    }
}

startServer();