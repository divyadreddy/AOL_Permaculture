import { uploadToR2 } from '../cloudflare-r2';
import { compressImage, validateImageFile, createImagePreview, generateUniqueFileName } from './imageCompression';

export const uploadImage = async (file, options = {}) => {
  try {
    // Validate the file
    validateImageFile(file);
    
    // Compress the image
    const compressedFile = await compressImage(file, options.compression);
    
    // Generate unique filename
    const fileName = generateUniqueFileName(file.name, options.prefix || 'product');
    
    // Create a new File object with the compressed blob
    const compressedFileObject = new File([compressedFile], fileName, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });
    
    // Upload to Cloudflare R2
    const imageUrl = await uploadToR2(compressedFileObject, fileName);
    
    return {
      url: imageUrl,
      fileName,
      originalSize: file.size,
      compressedSize: compressedFile.size,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files, options = {}) => {
  const uploadPromises = Array.from(files).map(file => uploadImage(file, options));
  const results = await Promise.allSettled(uploadPromises);
  
  const successful = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
    
  const failed = results
    .filter(result => result.status === 'rejected')
    .map(result => result.reason);
    
  return {
    successful,
    failed,
    total: files.length,
  };
};

export const handleFileSelect = async (event, options = {}) => {
  const files = event.target.files;
  if (!files || files.length === 0) return null;
  
  return await uploadMultipleImages(files, options);
};

export const handleDrop = async (event, options = {}) => {
  event.preventDefault();
  event.stopPropagation();
  
  const files = event.dataTransfer.files;
  if (!files || files.length === 0) return null;
  
  return await uploadMultipleImages(files, options);
};
