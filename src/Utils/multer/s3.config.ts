import {
     ObiectCannedACL,
     PutObiectCommand,
     S3Client,
    } from "@aws-sdk/client-s3";
import  {StorageEnum} from "./cloud.multer";
import { v4 as uuid} from "uuid";
import { BadRequestException} from "../response/error.response";
import { Upload } from "@aws-sdk/lib-storage";



  export const s3Config = () =>{
      return new S3Client({
    region: process.env.AWS_REGION as string,
    credentials:{
       accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
   },
  });
};


   export const uploadFile = async ({
    storageApproch = StorageEnum.MEMORY,
    Bucket = process.env.AWS_BUCKET_NAME as string,
    ACL = "private",
    path = "general",
    file,
 }: {
     storageApproch?: StorageEnum;
     Bucket?: string;
     ACL?: ObiectCannedACL;
     path?: string;
     file: Express.Multer.File;
 }) =>{

  const command = new PutObiectCommand ({
     Bucket,
     ACL,
    key: `${process.env.APPLICATION_NAME}/${path}/${uuid()}-${
        file.originalname
    }`,
    Body: storageApproch === StorageEnum.MEMORY ? file.buffer : file.path,
    Contenttype: file.mimetype,
 });
    await s3Config().send(command);

     console.log(command.input.Key);
  if (!command?.input?.Key)
     throw new BadRequestException("Fail to upload file");
return command. input .Key;

 };


   export const uploadLargeFile = async ({
    storageApproch = StorageEnum.MEMORY,
    Bucket = process.env.AWS_BUCKET_NAME as string,
    ACL = "private",
    path = "general",
    file,
 }: {
     storageApproch?: StorageEnum;
     Bucket?: string;
     ACL?: ObiectCannedACL;
     path?: string;
     file: Express.Multer.File;
 }) =>{

    const upload = new Upload({
    client: s3Config(),
    params: {
       Bucket,
       ACL,
       key: `${process.env.APPLICATION_NAME}/${path}/${uuid()}-${
         file.originalname
    }`,
    Body: storageApproch === StorageEnum.MEMORY ? file.buffer : file.path,
    Contenttype: file.mimetype,
    },
    partSize: 500 * 1024 * 1024,
 });
     upload.on("httpuploadProgress", (progress) => {
      console.log("uplaod Progress", progress);
 });
      const { Key } = await upload.done();
if (!key) throw new BadRequestException("Fail to uplaod file");
return Key;

};
