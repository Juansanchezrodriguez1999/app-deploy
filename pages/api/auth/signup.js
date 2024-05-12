import schema from '@/schema/user';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export default async function handler(req, res) {
  try {
    const data = req.body;
    const validate = await schema.validate(data);

    if (!validate.error) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: data.email }, { username: data.username }],
        },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'The email or username is already in use.' });
      }

      await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          fullname: data.fullname,
          password: await hashPassword(data.password),
          role: data.role,
        },
      });

      res.status(200).end();
    } else {
      return res.status(400).json({ error: 'Validation error' });
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}