import User from "../users/user.model.js";
import OTP from "./otp.model.js";

class AuthRepository {
  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  async createOTP(otpData) {
    return await OTP.create(otpData);
  }
}

export default new AuthRepository();