
import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


const otpStore: Record<string, { otp: string; expires: number }> = {};

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email, name, dateOfBirth } = req.body;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      if (!name || !dateOfBirth) {
        return res.status(400).json({ message: 'Name and date of birth are required.' });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
        return res.status(400).json({ message: 'Invalid date of birth format. Use YYYY-MM-DD.' });
      }
      const cleanName = String(name).trim();
      if (cleanName.length < 2) {
        return res.status(400).json({ message: 'Name is too short.' });
      }
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<p>Your OTP code is: <b>${otp}</b></p>`,
    });
    res.json({ message: 'OTP sent to email.' });
  } catch (err: any) {
    console.error('Error sending OTP email:', err);
    res.status(500).json({ message: 'Failed to send OTP email.', error: err?.message || err });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp, name, dateOfBirth } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }
    const record = otpStore[email];
    if (!record || record.otp !== otp || record.expires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    let user = await User.findOne({ email });
    if (!user) {
      if (!name || !dateOfBirth) {
        return res.status(400).json({ message: 'Name and date of birth are required for sign up.' });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
        return res.status(400).json({ message: 'Invalid date of birth format. Use YYYY-MM-DD.' });
      }
      const cleanName = String(name).trim();
      if (cleanName.length < 2) {
        return res.status(400).json({ message: 'Name is too short.' });
      }
      user = new User({ email, name: cleanName, dateOfBirth });
      try {
        await user.save();
      } catch (err: any) {
        return res.status(500).json({ message: 'Failed to create user.', error: err?.message || err });
      }
    }
    delete otpStore[email];
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'jwtsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, dateOfBirth: user.dateOfBirth, avatar: user.avatar } });
  } catch (err: any) {
    console.error('Error in verifyOtp:', err);
    res.status(500).json({ message: 'Internal server error.', error: err?.message || err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required.' });
    }
    const record = otpStore[email];
    if (!record || record.otp !== otp || record.expires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    delete otpStore[email];
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'jwtsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, dateOfBirth: user.dateOfBirth, avatar: user.avatar } });
  } catch (err: any) {
    console.error('Error in login:', err);
    res.status(500).json({ message: 'Internal server error.', error: err?.message || err });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ id: user._id, email: user.email, name: user.name, dateOfBirth: user.dateOfBirth, avatar: user.avatar });
  } catch (err: any) {
    console.error('Error in getUser:', err);
    res.status(500).json({ message: 'Internal server error.', error: err?.message || err });
  }
};
