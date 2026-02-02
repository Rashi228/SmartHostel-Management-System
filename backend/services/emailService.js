async sendPasswordResetEmail(user, resetToken) {
  try {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"SHMS - Security" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: "🔐 SHMS Password Reset Request",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
          <h1 style="color: #1976d2; text-align: center;">🔐 Password Reset</h1>
          <p>Hello ${user.name}, we received a request to reset your password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #1976d2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              Reset Your Password
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">This link expires in 10 minutes.</p>
        </div>
      </div>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Email error:", error);
    return { success: false, error: error.message };
  }
}