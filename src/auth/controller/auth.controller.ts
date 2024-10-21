import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../Model/create-user.dto';
import { LoginUserDto } from '../Model/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    //rout for create or signUp User
    @Post("/signUp")
    async createUser(@Body() createUser:CreateUserDto):Promise <{token:string}>
    {
        return this.authService.signUp(createUser);
    }
    
    //rout for login user
    @Post("Login")
    async loginUser(@Body() loginUser:LoginUserDto):Promise<{token:string}>
    {
        return this.authService.logIn(loginUser);
    }
}
