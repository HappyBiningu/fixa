import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import { sendOTP, verifyOTP } from "../utils/otp";

export class AuthService {
  async register(data: {
    phone: string;
    email?: string;
    password?: string;
    role: string;
    fullName?: string;
  }) {
    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.phone, data.phone))
      .limit(1);
    
    if (existing.length > 0) {
      throw new Error("Phone number already registered");
    }
    
    // Hash password if provided
    const passwordHash = data.password ? await hashPassword(data.password) : null;
    
    // Create user
    const [user] = await db
      .insert(users)
      .values({
        phone: data.phone,
        email: data.email,
        passwordHash,
        role: data.role,
        fullName: data.fullName,
        phoneVerified: false,
      })
      .returning();
    
    // Send OTP
    sendOTP(data.phone);
    
    return user;
  }
  
  async verifyPhone(phone: string, code: string) {
    if (!verifyOTP(phone, code)) {
      throw new Error("Invalid or expired OTP");
    }
    
    const [user] = await db
      .update(users)
      .set({ phoneVerified: true })
      .where(eq(users.phone, phone))
      .returning();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  }
  
  async login(phone: string, password?: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);
    
    if (!user) {
      throw new Error("Invalid credentials");
    }
    
    // If password is set, verify it
    if (user.passwordHash && password) {
      const valid = await comparePassword(password, user.passwordHash);
      if (!valid) {
        throw new Error("Invalid credentials");
      }
    }
    
    if (!user.phoneVerified) {
      throw new Error("Phone not verified");
    }
    
    // Update last active
    await db
      .update(users)
      .set({ lastActiveAt: new Date() })
      .where(eq(users.id, user.id));
    
    // Generate token
    const token = generateToken({
      userId: user.id,
      role: user.role,
      phone: user.phone,
    });
    
    return { user, token };
  }
  
  async resendOTP(phone: string) {
    sendOTP(phone);
    return { message: "OTP sent" };
  }
}

