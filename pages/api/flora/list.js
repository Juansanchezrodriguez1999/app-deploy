import { connectToDatabase } from '@/lib/mongo';

export default async function handler(req, res) {
  const parametros = req.query;
  const { db } = await connectToDatabase();
  const collection = await db.collection('floras');
  const filtro = {};
  let limit = 15;
  let count = 0;
  for (const key in parametros) {
    if (parametros[key] !== '' && parametros[key] !== 'false') {
      count++;
    }
  }
  if (count !== 0) {
    const parametros = req.query;
    const speciesSynonyms = parametros['Species'].split(',').filter((elemento) => elemento !== '');
    const altitude = [parametros['AltitudeMax'], parametros['AltitudeMin']];
    delete parametros['Species'];
    delete parametros['AltitudeMax'];
    delete parametros['AltitudeMin'];
    delete parametros['all'];
    if (speciesSynonyms.length > 0) {
      const lastSynonym = speciesSynonyms[speciesSynonyms.length - 1];
      const lastSynonymWords = lastSynonym.split(' ');
      if (lastSynonymWords.length === 2) {
        const regexString = `^${lastSynonym} (var\\.|subsp\\.|f\\.|[a-zA-Z]+ )`;
        const regex = new RegExp(regexString);
        filtro['$or'] = [{ 'Species.Name': { $in: speciesSynonyms } }, { 'Species.Name': { $regex: regex } }];
      } else {
        filtro['Species.Name'] = { $in: speciesSynonyms };
      }
    }
    if (altitude[0] !== '' && altitude[1] !== '') {
      filtro['Altitude'] = {
        $gte: parseFloat(altitude[1]),
        $lte: parseFloat(altitude[0]),
      };
    } else if (altitude[0] !== '' && altitude[1] === '') {
      filtro['Altitude'] = {
        $lte: parseFloat(altitude[0]),
      };
    } else if (altitude[0] === '' && altitude[1] !== '') {
      filtro['Altitude'] = {
        $gte: parseFloat(altitude[1]),
      };
    }

    for (const key in parametros) {
      if (parametros[key] !== '' && !Array.isArray(parametros[key])) {
        filtro[key] = { $regex: parametros[key], $options: 'i' };
      }
    }
  }
  try {
    const cursor = await collection.find(filtro, { _id: 1, Natural_Site: 1, Altitude: 1, Species: 1 }).limit(parseFloat(limit));
    const data = await cursor.toArray();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
}