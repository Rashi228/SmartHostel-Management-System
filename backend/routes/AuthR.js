// @route   POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const resetToken = user.generateResetToken();
  await user.save();

  const emailResult = await emailService.sendPasswordResetEmail(user, resetToken);
  res.json({ success: true, message: "Reset email sent" });
});

// @route   POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ success: false, message: "Invalid/Expired token" });

  user.password = password; // Middleware will hash this automatically if set up
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});