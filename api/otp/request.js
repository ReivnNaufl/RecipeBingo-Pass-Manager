import { transporter } from '../../lib/email.js';
import { generateOTP, storeOTP } from '../../lib/otp.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessKey = req.query.key;
  
  if (accessKey !== process.env.KEY) {
      return res.status(403).json({ error: 'Invalid Key' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const otp = generateOTP();
    await storeOTP(email, otp);

    await transporter.sendMail({
      from: {
        name: "RecipeBingo Authenticator",
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Your Verification Code',
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('OTP request error:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
}