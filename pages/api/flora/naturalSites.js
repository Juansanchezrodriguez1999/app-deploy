import { connectToDatabase } from '@/lib/mongo';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = await db.collection('floras');
    const cursor = await collection.find();
    const data = await cursor.toArray();
    const naturalSites = data.map((item) => item['Natural_Site']).filter((item) => item !== null);
    const uniqueSet = new Set(naturalSites.map((item) => item));
    const sortedUniques = Array.from(uniqueSet).sort();
    res.status(200).json(sortedUniques);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
