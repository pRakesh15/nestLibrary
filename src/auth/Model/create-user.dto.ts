import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email address' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;

    @IsOptional()
    readonly profilePic: string;

    @IsOptional()
    readonly role: string[];

}