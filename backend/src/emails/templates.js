export function otpTemplate(otp) {
  return `<p>Your Big Club Talk verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`;
}

export function resetPasswordTemplate(url) {
  return `<p>Reset your Big Club Talk password here: <a href="${url}">${url}</a>. This link expires in 15 minutes.</p>`;
}
