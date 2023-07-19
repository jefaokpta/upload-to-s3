/**
 * @author Jefferson Alves Reis (jefaokpta) < jefaokpta@hotmail.com >
 * Date: 06/07/23
 */
import {readdirSync, readFileSync} from 'fs';
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import path from "path";
import * as fs from "fs";


const s3 = new S3Client({
    region: 'us-east-1',
})
// console.log('Uploading file...')
//
// const fileContent = readFileSync('./arma.jpg');
//
// const params = {
//     Bucket: 'wip-medias',
//     Key: 'uploads/teste.jpg',
//     Body: fileContent,
//
// }
//
// s3.send(new PutObjectCommand(params))
//     .then(() => {
//         console.log(`File uploaded successfully. ${params.Key}`);
//     })
//     .catch((err) => {
//         console.log(err);
//     })

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

function restoreFolderFromS3(bucketName: string, folderPath: string) {
    const params = {
        Bucket: bucketName,
        Prefix: folderPath
    }

    s3.listObjectsV2(params)
        .then(data => {
            for (const item of data.Contents) {
                const params = {
                    Bucket: bucketName,
                    Key: item.Key
                }
                s3.getObject(params)
                    .then(data => {
                        fs.writeFileSync(item.Key, data.Body)
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

