import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);

export class ImagesAccess{

    constructor(
        private readonly s3: AWS.S3 = createS3Client(),
        private readonly bucketName = process.env.IMAGES_S3_BUCKET
    ){}

    async getUploadUrl(todoId: string) : Promise<string> {
        return this.s3.getSignedUrl('putObject',{
            Bucket: this.bucketName,
            Key: todoId,
            Expires: 300
        })
    }

}



function createS3Client(){
    if(process.env.IS_OFFLINE){
        console.log('Creating a local s3 instance');
        return new XAWS.S3({
            signatureVersion: 'v4'
        })
    }
    return new XAWS.S3({
        signatureVersion: 'v4'
    })
}