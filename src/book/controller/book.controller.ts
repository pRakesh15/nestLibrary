import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BookService } from '../services/book.service';
import { Book } from '../Model/book.schema';
import { CreateBookDto } from '../Model/create-book.dto';
import {Query as ExpressQuery} from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
@Controller('book')
export class BookController {
    constructor(private bookService:BookService){}

    //router and controller for get all books
    //with query for search  i can add the query parameters key name also 
    
    @Get("/all")
    getBooks(@Query() query:ExpressQuery)
    {
        return this.bookService.findAll(query);
    }

  //router for add books;
    @Post("/addBook") 
    @UseGuards(AuthGuard())
  async createBooks( @Body() addBook:CreateBookDto,@Req() req):Promise<Book>
    {
        //pass the user who is creating the book.
       return await this.bookService.addBook(addBook,req.user);
    }

    //router for get book by id

    @Get("/:id")
    async getBookById(@Param("id") id:string):Promise<Book>
    {
        return await this.bookService.getBookByid(id);
    }

    //route for get by id and update
    @Put("/:id")
    async updateBookById(@Param("id") id:string, @Body() book:Book):Promise<Book>
    {
        return await this.bookService.updateBookById(id,book);
    }

    //route for get by id and delete
    @Delete("/:id")
    async deleteBookById(@Param("id") id:string):Promise<Book>
    {
        return await this.bookService.deleteBookById(id);
    }

    //rout for upload book images or files

    @Put("uploadImage/:id")
    @UseInterceptors(FilesInterceptor('files'))
    //using uploadfiles for upload the images in the backend
    async uploadBookImage(@Param("id") id:string,@UploadedFiles(
      //Add the validators for type and size 
      new ParseFilePipeBuilder().addFileTypeValidator({
        fileType:/(jpg|jpeg|png)$/,
      }).addMaxSizeValidator({
        maxSize:3145728,
        message:'file size must be less than 3MB'
      })
      .build({
        errorHttpStatusCode:HttpStatus.UNPROCESSABLE_ENTITY,
      }),
      //using multer for upload or process the image or files.
      // in simple nodejs there are some extra code we have to write for upload the files using multer 
      // but in nest there is  no need of write extra code ..
    ) files:Array<Express.Multer.File>)
    {
      
      return this.bookService.uploadBookImages(id,files);
    }


}
