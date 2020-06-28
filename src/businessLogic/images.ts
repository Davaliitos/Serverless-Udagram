import { S3Access } from '../dataLayer/s3Access';

const s3Access = new S3Access();

export async function getUploadUrl(todoId: string): Promise<string>{

    return await s3Access.getUploadUrl(todoId);

}

