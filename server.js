const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require("cors")
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8080;

// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const url = process.env.MONGO_URL;
const dbName = 'SkynoveaDatabase';

const  connectToDatabase = async()=> {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);
  return { client, db };
}

app.post('/feedback', async (req, res) => {
  const data = req.body;
  try {
    const { client, db } = await connectToDatabase();
    const collection = db.collection('feedback');
    const result = await collection.insertOne(data);
    client.close();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log('Server listening on port 8080');
});
