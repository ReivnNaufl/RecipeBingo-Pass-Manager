import { keyDb } from './firebase.js'; // Use your secondary Firebase app
const otpCollection = keyDb.collection('otps');

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(email, otp) {
  const docRef = otpCollection.doc(email);
  await docRef.set({
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0
  });
}

export async function verifyOTP(email, submittedOtp) {
  const docRef = otpCollection.doc(email);
  const snapshot = await docRef.get();

  if (!snapshot.exists) return false;

  const record = snapshot.data();

  if (Date.now() > record.expiresAt) return false;
  if (record.attempts >= 3) return false;

  await docRef.update({ attempts: record.attempts + 1 });

  if (record.otp === submittedOtp) {
    await docRef.delete(); // Optional: invalidate OTP
    return true;
  }

  return false;
}

export async function checkOTPStatus(email) {
  const snapshot = await otpCollection.doc(email).get();

  if (!snapshot.exists) return { exists: false };

  const record = snapshot.data();

  return {
    exists: true,
    expiresIn: Math.max(0, record.expiresAt - Date.now()),
    attempts: record.attempts
  };
}
