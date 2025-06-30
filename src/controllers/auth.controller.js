import { AuthService } from "../services/index.js";
import { ApiResponse } from "../utils/ApiResponse";

class AuthController{
    constructor(){
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.veryfyOTP = this.verifyOTP.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
    }


    async login(req, res, next){
        const APIresponse = new ApiResponse(res);
        try {
            const {method} = req.query;
            const {email, password, phoneNumber} = req.body;
            if (method === 'otp') {
                const response = await AuthService.sendOTP(phoneNumber);
                return APIresponse.successResponse({
                    message: 'OTP sent successfully',
                    data: response
                });
            }
            else if (method === 'email') {
                const response = await AuthService.emailLogin(email, password);
                return APIresponse.successResponse({
                    message: 'Login successful',
                    data: response
                });

            } else {
                return APIresponse.errorResponse({
                    message: 'Invalid login method',
                    errorCode: 'INVALID_LOGIN_METHOD'
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async register(req, res, next){
        const APIresponse = new ApiResponse(res);
        try {
            const {method} = req.query;
            const {name, email, password, phoneNumber} = req.body;
            if (method === 'otp') {
                const response=  await AuthService.sendOTP(phoneNumber);
                return APIresponse.successResponse({
                    message: 'OTP sent successfully',
                    data: response
                });
            }
            else if (method === 'email') {
                const response = await AuthService.register(name, email, password);
                return APIresponse.successResponse({
                    message: 'Registration successful',
                    data: response
                });
            } else {
                return APIresponse.errorResponse({
                    message: 'Invalid registration method',
                    errorCode: 'INVALID_REGISTRATION_METHOD'
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async verifyOTP(req, res, next){
        const APIresponse = new ApiResponse(res);
        try {
            const {phoneNumber, otp, sessionId} = req.body;
            const isVerified = await this.verifyOtp(phoneNumber, otp, sessionId);
            return APIresponse.successResponse({
                message: 'OTP verified successfully',
                data: { isVerified }
            });
            
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next){
        const APIresponse = new ApiResponse(res);
        try {
            const {refreshToken} = req.body;
            const response = await this.refreshAccessToken(refreshToken);
            return APIresponse.successResponse({
                message: 'Token refreshed successfully',
                data: response
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();