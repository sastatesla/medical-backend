import prisma from "../configs/db.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/jwt.js";

class AuthServie{
    constructor(){
        this.emailLogin = this.emailLogin.bind(this);
        this.register = this.register.bind(this);
        this.sendOTP = this.sendOTP.bind(this);
        this.verifyOTP = this.verifyOTP.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
    }

     async register(name, email, password){
        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (existingUser) {
                throw ApiError.AlreadyExists('User already exists', 'USER_ALREADY_EXISTS');
            }
            const hashedPassword = await bcrypt.hash(password, 10); 

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password:hashedPassword
                }
            });

            const token = await generateToken(user);

            return { user, token };
        } catch (error) {
           
            throw ApiError.BadRequest('Registration failed', 'REGISTRATION_ERROR', error);
            
        }
    

    }

    async emailLogin(email, password){
        

    }
    async sendOTP(phoneNumber){
        // Logic to send OTP
        // This could involve generating an OTP, saving it to the database, and sending it via SMS
    }
    async verifyOTP(phoneNumber, otp, sessionId){
        // Logic to verify OTP
    }
    async refreshToken(){
}
}

export default new AuthServie();