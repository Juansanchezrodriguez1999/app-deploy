import { connectToDatabase } from '@/lib/mongo';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = await db.collection('floras');

    const cursor = await collection.find();

    const data = await cursor.toArray();
    const taxa = data.map((item) => item.Species.map((species) => species.Name));

    const uniques = [...new Set(taxa.flat())];
    const sortedUniques = uniques.sort();

    res.status(200).json(sortedUniques);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}
