import prisma from '/lib/prisma';

export default async function handler(req, res) {
  const { params } = req.query;
  const userId = parseInt(params[0]);
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}