import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginUserDto {

    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email address' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

}