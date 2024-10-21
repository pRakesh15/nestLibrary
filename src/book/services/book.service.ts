import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from '../Model/book.schema';
import mongoose from 'mongoose';
import { Query } from 'express-serve-static-core'
import { CreateBookDto } from '../Model/create-book.dto';
import { User } from 'src/auth/Model/user.schema';
import { uploadImage } from '../utils/aws.book';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) { }

    //function for get all the book available 
    async findAll(query: Query): Promise<Book[]> {

        //here 1st check the keyword is present or note 
        //then check the data is available in the db or ont
        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}
        // console.log(query)
        //here i implement the pagination like according to the page the data is send
        const rePerPage = 5;
        const currentPage = Number(query.page) || 1;
        const skip = rePerPage * (currentPage - 1);

        //apply all the monngodb functions.
        return await this.bookModel.find({ ...keyword }).limit(rePerPage).skip(skip);

    }

    //function for add books 

    async addBook(book: CreateBookDto, user: User): Promise<Book> {
        //while create a book store the user who is creating the book 
        const data = Object.assign(book, { user: user._id })
        return this.bookModel.create(data);
    }

    //function  for get book by id

    async getBookByid(id: string): Promise<Book> {
        const isValidId = mongoose.isValidObjectId(id)
        if (!isValidId) throw new BadRequestException('Please select a valid book id')
        const book = await this.bookModel.findById(id);
        if (!book) throw new NotFoundException('book not Found.')
        return book;
    }

    //function for update book by id

    async updateBookById(id: string, book: Book): Promise<Book> {
        return this.bookModel.findByIdAndUpdate(id, book)
    }

    //function for delete book by id

    async deleteBookById(id: string): Promise<Book> {
        return this.bookModel.findByIdAndDelete(id)
    }

    //function for  upload images for book

    //in files we receive the files or images in array format.
    //we  are using MULTER for upload the images inside the database.
    async uploadBookImages(id: string, files: Array<Express.Multer.File>) {
//find the book if it is exit or note.
        const book=await this.bookModel.findById(id);

        if(!book) throw new NotFoundException('Book Not found.');

        //if exit then call the function for upload the image in s3.
        const images=await uploadImage(files)

        //after successfully add the image in s3 save it in database using SAVE method.
        book.images=images as object[];
 
        //save image in database.
        await book.save();

        return book;
    }
}
