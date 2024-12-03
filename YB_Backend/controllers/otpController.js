import { generateOTP, sendOTPEmail, storeOTP, verifyOTP } from "../utils/otpUtils.js";

export const sendOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({message: 'Email is required'});

    try {
        const otp = generateOTP();
        await sendOTPEmail(email, otp);
        storeOTP(email, otp);
        res.status(200).json({ message: 'OTP snet successfully' })
    } catch (error) {
        console.error('Error in sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' })
    }
}

export const verifyOTPController = (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const { valid, message } = verifyOTP(email, otp);
    if(valid) {
        console.log('OTP Verified', { email, otp });
        return res.status(200).json({ message });
    }

    res.status(400).json({ message });
}

