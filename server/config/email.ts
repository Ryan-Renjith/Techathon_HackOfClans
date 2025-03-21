import nodemailer from 'nodemailer';
import { UserDocument } from '../types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendApplicationNotification = async (
  employer: UserDocument,
  jobTitle: string,
  applicantName: string
): Promise<void> => {
  const subject = `New Application for ${jobTitle}`;
  const html = `
    <h1>New Job Application Received</h1>
    <p>Hello ${employer.fullName},</p>
    <p>${applicantName} has applied for the position of ${jobTitle}.</p>
    <p>You can review the application in your dashboard.</p>
  `;

  await sendEmail(employer.email, subject, html);
};

export const sendApplicationStatusUpdate = async (
  applicant: UserDocument,
  jobTitle: string,
  status: string
): Promise<void> => {
  const subject = `Application Status Update - ${jobTitle}`;
  const html = `
    <h1>Your Application Status Has Been Updated</h1>
    <p>Hello ${applicant.fullName},</p>
    <p>Your application for ${jobTitle} has been ${status}.</p>
    <p>You can check the details in your applications dashboard.</p>
  `;

  await sendEmail(applicant.email, subject, html);
};