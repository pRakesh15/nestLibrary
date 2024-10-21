import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt"
import { User } from "./Model/user.schema";
import { Model } from "mongoose";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload) {
        //after login i store the user id in the token and store it in payload 
        //from payload i retrieve the id of the user .
        const { id } = payload;
        //check the user is present/login or not 
        const user = await this.userModel.findById(id);
        //if the user is not login then throw a error .
        if (!user) throw new UnauthorizedException('login First to access this page.')

        return user;
    }

}