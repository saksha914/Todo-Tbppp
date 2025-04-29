import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateToken } from '../utils/auth.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Generate verification token
        const verificationToken = generateToken(user._id, '1h');

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully. Please check your email for verification.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profile: user.profile
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isEmailVerified = true;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = generateToken(user._id, '1h');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send reset email
        await sendEmail({
            to: email,
            subject: 'Password Reset',
            html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}">
          Reset Password
        </a>
      `
        });

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending reset email', error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error resetting password', error: error.message });
        atus(500).json({ message: 'Error logging in', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, bio, preferences } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profile = {
            ...user.profile,
            firstName,
            lastName,
            bio,
            preferences: preferences ? { ...user.profile.preferences, ...preferences } : user.profile.preferences
        };

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            profile: user.profile
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ profile: user.profile });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};
