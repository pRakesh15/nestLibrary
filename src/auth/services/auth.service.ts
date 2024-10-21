import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../Model/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../Model/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../Model/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Function for creating a user or user signUp
  async signUp(createUser: CreateUserDto): Promise<{ token: string }> {
    const { name, email, password, profilePic,role } = createUser;

    // Corrected: Await bcrypt.hash since it's async
    const hashedPassword = await bcrypt.hash(password, 10);

    // Corrected: Await the user creation
    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
      role
    });

    // Generate the token after user is created
    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  // Function for login user using the email and password
  async logIn(loginUser: LoginUserDto): Promise<{ token: string,user:{name:string,email:string} }> {
    const { email, password } = loginUser;

    // Corrected: Await the findOne query to get the user
    const user = await this.userModel.findOne({ email });

    // Throw an error if the user is not found
    if (!user) throw new UnauthorizedException('User not found');

    // Compare the password entered by the user with the hashed password in the DB
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If the password does not match, throw an error
    if (!isPasswordMatch) throw new UnauthorizedException('Incorrect Password');

    // If password matches successfully, return the token
    const token = this.jwtService.sign({ id: user._id });

    //after successfully login return the token with name and email of that user.
    return { token:token,user:{
      name:user.name,
      email:user.email
    } };
  }
}
