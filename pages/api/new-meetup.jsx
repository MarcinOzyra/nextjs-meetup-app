import { MongoClient } from 'mongodb';
import { MONGODB_STRING } from '../../mongodb';

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const client = await MongoClient.connect(MONGODB_STRING);
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const result = await meetupsCollection.insertOne({ data });
    client.close();
    res.status(201).json({ message: 'Record inserted!' });
  }
}

export default handler;
