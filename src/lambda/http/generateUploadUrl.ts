import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS  from 'aws-sdk'
import 'source-map-support/register';

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
  
    const url = getUploadUrl(todoId);

    return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: url
        })
      }
    
}

function getUploadUrl(todoId: string){
    return s3.getSignedUrl('putObject',{
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration
    })
}

  