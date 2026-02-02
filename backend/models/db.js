// Add these fields to your User Schema
const userSchema = new mongoose.Schema({
  // ... existing fields (name, email, password, etc.)
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Add this method to generate the secure token
userSchema.methods.generateResetToken = function() {
  // Create raw token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (e.g., 10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};