import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
 
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // here im using mongodb direct ..
    //if i use orm then i have to install typeOrm module
    MongooseModule.forRoot(process.env.DB_URL),
    BookModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
