import { connectToDatabase } from '@/lib/mongo';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = await db.collection('natural_park_species');
    const cursor = await collection.find();
    const data = await cursor.toArray();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
