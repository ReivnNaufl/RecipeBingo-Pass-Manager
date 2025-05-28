// Use Redis or database in production
const otpStore = new Map();

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(email, otp) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    attempts: 0
  });
}

export async function verifyOTP(email, otp) {
  const record = otpStore.get(email);
  
  if (!record) return false;
  if (Date.now() > record.expiresAt) return false;
  if (record.attempts >= 3) return false;
  
  otpStore.set(email, { ...record, attempts: record.attempts + 1 });
  
  if (record.otp === otp) {
    otpStore.delete(email);
    return true;
  }
  
  return false;
}

export async function checkOTPStatus(email) {
  const record = otpStore.get(email);
  
  if (!record) {
    return { exists: false };
  }
  
  return {
    exists: true,
    expiresIn: Math.max(0, record.expiresAt - Date.now()),
    attempts: record.attempts
  };
}