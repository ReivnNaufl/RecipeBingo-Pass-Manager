import { verifyOTP } from '../../lib/otp.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessKey = req.query.key;
  
  if (accessKey !== process.env.KEY) {
      return res.status(403).json({ error: 'Invalid Key' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const isValid = await verifyOTP(email, otp);
    
    if (isValid) {
      return res.status(200).json({ 
        success: true
      });
    }
    
    return res.status(400).json({ error: 'Invalid OTP' });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ error: 'OTP verification failed' });
  }
}