import { S3 } from "aws-sdk"

//here i write a function for upload the images in the aws s3 bucket in a bulk amount or in array.
 
//for uploading file in backend we are using multer for file upload.
export async function uploadImage(files:Array<Express.Multer.File>) {
    return new Promise((resolve,reject)=>
    {
        try {
            //add the s3 credential .
            const s3=new S3({
                accessKeyId:process.env.accessKey_id,
                secretAccessKey:process.env.secreateAccess_key,
            });
            //create a empty array for store the image.
            const images=[];

            files.forEach(async(file)=>{
                const filename=file.originalname;

                const params={
                    //create a books folder in s3 bucket 
                    Bucket:`${process.env.bucket_name}/books`,
                    Key:filename,
                    Body:file.buffer

                }
                     //By using upload function upload the images in s3.
                const uploadResponse=await s3.upload(params).promise();   

                images.push({
                    Bucket:uploadResponse.Bucket,
                    Key:uploadResponse.Key,
                    Location:uploadResponse.Location
                });
                //check the input image length and upload image length.
                if(images?.length===files.length) resolve(images);
            });
        } catch (error) {
            return error;
        }
    })
}