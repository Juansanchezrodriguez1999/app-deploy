import nodemailer from 'nodemailer';
import prisma from '/lib/prisma';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});
export default async function handler(req, res) {
  const { params } = req.query;
  const emailUser = params[0]
  const username = params[1]
  try {
    const adminsEmails = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
      select: {
        email: true
      }
    });

    const adminsEmailsArray = adminsEmails.map(user => user.email);
    const combinedEmails = adminsEmailsArray.join(',');

    const mailOptionsPrincipals = {
      from: process.env.GMAIL_USER,
      to: combinedEmails,
      subject: 'New User',
      text: ` 
    Dear Admin,

    A new user has joined your app. Here are the details:
    
    User Name: ${username}
    Email Address: ${emailUser}
    
    Please review the user's profile and decide whether to allow or delete the user. You can manage group membership through your admin dashboard.
    
    Best regards,
    Web Team
`,
    };

    await transporter.sendMail(mailOptionsPrincipals);

    const mailOptionsNewUser = {
      from: process.env.GMAIL_USER,
      to: emailUser,
      subject: 'Registration Confirmed - Welcome',
      text: `
    Dear ${username},

    Welcome to the web! Your registration has been confirmed. 
    Feel free to explore the tools on our platform.
    
    Best regards,
    Web Team
`,
    };

    await transporter.sendMail(mailOptionsNewUser);
    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}