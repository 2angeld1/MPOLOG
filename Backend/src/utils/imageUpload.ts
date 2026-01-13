import cloudinary from '../config/cloudinary';

/**
 * Sube una imagen en base64 a Cloudinary y devuelve la URL segura.
 * Si la entrada ya es una URL, la devuelve tal cual.
 * @param imageContent El contenido de la imagen (base64 o URL)
 * @param folder Carpeta en Cloudinary
 */
export const uploadImage = async (imageContent: string | null | undefined, folder: string = 'yappy_proofs'): Promise<string | null> => {
    if (!imageContent) return null;
    
    // Si ya es una URL de Cloudinary o externa, no hacemos nada
    if (imageContent.startsWith('http')) {
        return imageContent;
    }

    // Si es base64, la subimos
    if (imageContent.startsWith('data:image')) {
        try {
            console.log('Subiendo imagen a Cloudinary, longitud:', imageContent.length);
            const uploadResponse = await cloudinary.uploader.upload(imageContent, {
                folder: folder,
                resource_type: 'image', // Cambiado de 'auto' a 'image' para ser más específicos
            });
            console.log('Imagen subida exitosamente:', uploadResponse.secure_url);
            return uploadResponse.secure_url;
        } catch (error: any) {
            console.error('Error al subir imagen a Cloudinary:', error);
            throw new Error(`No se pudo subir la imagen: ${error.message || 'Error desconocido'}`);
        }
    }

    return imageContent;
};
