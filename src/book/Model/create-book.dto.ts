import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Catrgory } from "./book.schema";
import { User } from "src/auth/Model/user.schema";


export class CreateBookDto {
    //using validation pipes for checking like the inputs are valid or not..
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly author: string;

    @IsNotEmpty()
    //we can make custom error message for the user bt there are also default message are available .
    @IsNumber({},{message:"price must be a number"})
    readonly price: number;

    @IsNotEmpty()
    @IsEnum(Catrgory,{message:'please enter a valid category'})
    readonly category: Catrgory;

    @IsEmpty()
    readonly user:User
}