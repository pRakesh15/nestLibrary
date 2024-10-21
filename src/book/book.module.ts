import { Module } from '@nestjs/common';
import { BookService } from './services/book.service';
import { BookController } from './controller/book.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from './Model/book.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    //import the auth module for protect the book routs according to the user.
    AuthModule,
    MongooseModule.forFeature([{name:'Book',schema:BookSchema}])],
  providers: [BookService],
  controllers: [BookController]
})
export class BookModule {}
