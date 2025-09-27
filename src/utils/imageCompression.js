import imageCompression from 'browser-image-compression';

const defaultOptions = {
  maxSizeMB: 1, // Maximum file size in MB
  maxWidthOrHeight: 1920, // Maximum width or height
  useWebWorker: true,
  maxIteration: 10,
  fileType: 'image/jpeg',
  initialQuality: 0.8,
};

export const compressImage = async (file, options = {}) => {
  try {
    const compressionOptions = { ...defaultOptions, ...options };
    
    // Don't compress if file is already small enough
    if (file.size / 1024 / 1024 <= compressionOptions.maxSizeMB) {
      return file;
    }

    const compressedFile = await imageCompression(file, compressionOptions);
    
    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compression ratio: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`);
    
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  return true;
};

export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateUniqueFileName = (originalFileName, prefix = 'product') => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalFileName.split('.').pop();
  return `${prefix}_${timestamp}_${randomString}.${extension}`;
};
