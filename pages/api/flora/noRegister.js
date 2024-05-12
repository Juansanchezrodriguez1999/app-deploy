import { connectToDatabase } from '@/lib/mongo';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = await db.collection('floras');
    const cursor = await collection.find();
    const data = await cursor.toArray();
    const noRegister = data.map((item) => item['_id']);
    const uniqueSet = new Set(noRegister.map((item) => item.toLowerCase()));
    const sortedUniques = Array.from(uniqueSet).sort();
    res.status(200).json(sortedUniques);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}