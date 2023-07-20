/**
 * @author Jefferson Alves Reis (jefaokpta) < jefaokpta@hotmail.com >
 * Date: 06/07/23
 */
import {readdirSync, readFileSync} from 'fs';
import {GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import path from "path";
import * as fs from "fs";


const s3 = new S3Client({
    region: 'us-east-1',
})

function uploadFile(){
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
}

//uploadFile();

function uploadFolderToS3(folderPath: string, bucketName: string) {
    const folderContent = readdirSync(folderPath, { withFileTypes: true });

    for (const item of folderContent) {
        const itemPath = path.join(folderPath, item.name);
        const params = {
            Bucket: bucketName,
            Key: `auths/${itemPath}`,
            Body: fs.readFileSync(itemPath)
        }
        s3.send(new PutObjectCommand(params))
            .then(() => {
                console.log(`File uploaded successfully. ${params.Key}`);
            }).catch(err => {
                console.log(err);
            })
    }
}

//uploadFolderToS3('./auth_info_multi-100023', 'wip-medias');

function restoreFolderFromS3(bucketName: string, folderName: string) {
    const params = {
        Bucket: bucketName,
        Prefix: `auths/${folderName}`
    }

    s3.send(new ListObjectsCommand(params))
        .then(data => {
            if (!data.Contents){
                console.log('Sem arquivos.')
                return
            }
            fs.existsSync(folderName) || fs.mkdirSync(folderName)
            for (const item of data.Contents) {
                console.log(item.Key)
                const params = {
                    Bucket: bucketName,
                    Key: item.Key
                }
                console.log(item.Key?.substring(item.Key?.indexOf('/') + 1))

                s3.send(new GetObjectCommand(params))
                    .then(async data => {
                        fs.writeFileSync(`./${folderName}/${item.Key?.split('/').pop()}`, await data.Body!.transformToString('utf-8'))
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
        .catch(err => {
            console.log(err)
        })
}

restoreFolderFromS3('wip-medias', 'auth_info_multi-100023/');

