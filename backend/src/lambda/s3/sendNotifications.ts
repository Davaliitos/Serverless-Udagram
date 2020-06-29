import { S3Handler, S3Event } from 'aws-lambda';
import 'source-map-support/register';
import { updateImage } from '../../businessLogic/todos';

export const handler: S3Handler = async (event: S3Event) => {
    for (const record of event.Records){
        const key = record.s3.object.key;
        console.log('Processing S3 item with key', key);
        const answer = await updateImage(key);
        console.log(answer);
    }
}