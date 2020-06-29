import { ImagesAccess } from '../dataLayer/imagesAccess';

const imagesAccess = new ImagesAccess();

export async function getUploadUrl(todoId: string): Promise<string>{

    return await imagesAccess.getUploadUrl(todoId);

}

