import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';
import _import1 from '../services/index.js';
const { authService, userService, tokenService, emailService } = _import1;

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const otp = await tokenService.generateOTPToken(user);
  console.log('Generated OTP:', otp);
  console.log('User ID:', user.id);
  await emailService.sendOTPEmail(user.email, otp);
  res.status(httpStatus.CREATED).send({
    message: 'OTP sent to email',
    userId: user.id
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const demoLogin = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email || !email.startsWith('demo_') || !email.endsWith('@example.com')) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid demo email format');
  }
  const user = await authService.loginOrRegisterDemoUser(email);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  console.log(`[Forgot Password] Token for ${req.body.email}: ${resetPasswordToken}`);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMe = catchAsync(async (req, res) => {
  res.send({ user: req.user });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { userId, otp } = req.body;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await tokenService.verifyOTPToken(otp, userId);

  Object.assign(user, { isEmailVerified: true });
  await user.save();

  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

export default {
  register,
  login,
  demoLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  getMe,
  verifyOTP,
};
