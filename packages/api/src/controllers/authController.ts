import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export async function register(req: Request, res: Response) {
  try {
    const { phone, email, password, role, fullName } = req.body;
    
    if (!phone || !role) {
      return res.status(400).json({ error: "Phone and role are required" });
    }
    
    const user = await authService.register({
      phone,
      email,
      password,
      role,
      fullName,
    });
    
    res.status(201).json({ user, message: "Registration successful. Please verify your phone." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function verifyPhone(req: Request, res: Response) {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.status(400).json({ error: "Phone and code are required" });
    }
    
    const user = await authService.verifyPhone(phone, code);
    res.json({ user, message: "Phone verified successfully" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { phone, password } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }
    
    const result = await authService.login(phone, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export async function resendOTP(req: Request, res: Response) {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: "Phone is required" });
    }
    
    await authService.resendOTP(phone);
    res.json({ message: "OTP sent" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    // This would fetch full user profile
    res.json({ userId: req.userId, role: req.userRole, phone: req.userPhone });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

