/**
 * Simple OTP generator and validator
 * In production, use a service like Twilio for SMS delivery
 */

const otpStore = new Map<string, { code: string; expiresAt: number }>();

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(phone: string, code: string): void {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(phone, { code, expiresAt });
}

export function verifyOTP(phone: string, code: string): boolean {
  const stored = otpStore.get(phone);
  if (!stored) return false;
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  
  if (stored.code === code) {
    otpStore.delete(phone);
    return true;
  }
  
  return false;
}

export function sendOTP(phone: string): string {
  const code = generateOTP();
  storeOTP(phone, code);
  
  // In production, integrate with Twilio or similar service
  console.log(`OTP for ${phone}: ${code}`);
  
  return code;
}

