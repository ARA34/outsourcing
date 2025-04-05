const express = require('express');
const admin = require('firebase-admin');
// const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Load your Firebase credentials
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(express.json());


app.post('/save', async (req, res) => {

    app.use((req, res, next) => {
        console.log(`Incoming: ${req.method} ${req.url}`);
        next();
    });
  const { userId, data } = req.body;

  if (!userId || !data) {
    return res.status(400).send("Missing userId or data.");
  }

  try {
    await db.collection('players').doc(userId.toString()).set(data);
    res.send("Data saved!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving data.");
  }
});


app.post('/load', async (req, res) => {
    app.use((req, res, next) => {
        console.log(`Incoming: ${req.method} ${req.url}`);
        next();
    });
  const { userId } = req.body;

  try {
    const doc = await db.collection('players').doc(userId.toString()).get();
    if (!doc.exists) return res.status(404).send("Not found");

    res.send(doc.data());
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading data.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});