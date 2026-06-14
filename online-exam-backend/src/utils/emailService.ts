import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY || "",
});

export const sendOtpEmail = async (
  toEmail: string,
  otp: number,
): Promise<void> => {
  await brevo.transactionalEmails.sendTransacEmail({
    to: [{ email: toEmail }],
    sender: {
      email: process.env.EMAIL_FROM || "",
      name: "Online Exam Platform",
    },
    subject: "Your OTP Verification Code",
    htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4F46E5;">Online Exam Platform</h2>
                <p>Aapka OTP verification code:</p>
                <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
                <p style="color: #666;">Yeh OTP <strong>10 minutes</strong> mein expire ho jayega.</p>
                <p style="color: #999; font-size: 12px;">Agar aapne yeh request nahi ki toh ignore karein.</p>
            </div>
        `,
  });
};
