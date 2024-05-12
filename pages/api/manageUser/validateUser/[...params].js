import prisma from '/lib/prisma';

export default async function handler(req, res) {
  const { params } = req.query;
  const userId = parseInt(params[0]);
  const role = params[1];
  try {
    if (role === "USER") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          role: 'ADMIN'
        }
      });
    }
    else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          role: 'USER'
        }
      });
    }

    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}