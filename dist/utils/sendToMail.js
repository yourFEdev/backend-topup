"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendToMail = async (email, subject, html) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email berhasil dikirim ke ${email}`);
    }
    catch (error) {
        console.error('Gagal mengirim email:', error);
        throw new Error('Email gagal dikirim');
    }
};
exports.sendToMail = sendToMail;
