import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';

import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './Model/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.stratergy';
@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            //this is use for access .env file .
            inject: [ConfigService],
            //By using Config we can access the env files.
            //in simple node js we use process.env.env_name...
            useFactory: (config: ConfigService) => {
                return {
                    //in nest js we are using config.get to access the env key...
                    secret: config.get<string>("JWT_SECRET"),
                    signOptions:
                    {
                        expiresIn: config.get<string | number>("JWT_EXPAIR"),

                    }
                }
            }
        }),
        //here i initialize the schema name as User in mongodb.
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
    ],
    controllers: [AuthController],
    providers: [AuthService,JwtStrategy],
    //export the jwt strategy for make the routs protected .
    exports:[JwtStrategy,PassportModule]

})
export class AuthModule { } 
