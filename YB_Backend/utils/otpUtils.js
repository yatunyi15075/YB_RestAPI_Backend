import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
//opt storage
const otpStore = new Map()

//genrate our otp
export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${email}. It will expire in 5 minutes`
        });
        console.log(`OTP send to ${email}: ${otp}`);
    } catch (error) {
        console.error('Failed to send OTP:', error);
        throw new Error('Email sending failed');
    }
};


//store otp
export const storeOTP =(email, otp) => {
    otpStore.set(email, {otp, expiresAt: Date.now() + 5 * 60 * 1000});
}

//verify otp
export const verifyOTP =(email, otp) => {
    const record = otpStore.get(email);
    if (!record) return { valid: false, message:'No OTP found for this email'};
    if (record.expiresAt < Date.now()) {
        otpStore.delete(email);
        return { valid: false, message: 'OTP expired' }
    }
    if (record.otp != otp) return { valid: false, message: 'Invalid OTP' };

    otpStore.delete(email)
    return { valid: true, message: 'OTP verified successifuly' }
};

