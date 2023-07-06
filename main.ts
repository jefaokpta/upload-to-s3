/**
 * @author Jefferson Alves Reis (jefaokpta) < jefaokpta@hotmail.com >
 * Date: 06/07/23
 */
import { readFileSync } from 'fs';
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";


const s3 = new S3Client({
    region: 'us-east-1',
})
console.log('Uploading file...')

const fileContent = readFileSync('./arma.jpg');

const params = {
    Bucket: 'wip-medias',
    Key: 'uploads/teste.jpg',
    Body: fileContent,

}

s3.send(new PutObjectCommand(params))
    .then(() => {
        console.log(`File uploaded successfully. ${params.Key}`);
    })
    .catch((err) => {
        console.log(err);
    })
