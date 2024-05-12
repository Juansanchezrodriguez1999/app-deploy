
import schema from '@/schema/userUpdate';
import bcrypt from 'bcrypt';

import prisma from '@/lib/prisma';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export default async function handler(req, res) {
  const data = req.body;
  const { id } = req.query;
  const userId = parseInt(id);
  try {
    await schema.validate(data);
    const updateData = {};
    if (data.fullname !== undefined) {
      updateData.fullname = data.fullname;
    }
    if (data.password !== '') {
      updateData.password = await hashPassword(data.password);
    }
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    res.status(200).end();
  } catch (err) {
    console.log('error', err);
    res.status(400).json({ error: err.message });
  }
}
