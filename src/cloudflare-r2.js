import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 configuration
const R2_S3_ENDPOINT = 'https://3f7449f6107cb515185cd38ca8b8059c.r2.cloudflarestorage.com'; // S3-compatible endpoint
const R2_ACCESS_KEY_ID = '91e8fc87a185b173dccf55113fb1dce9';
const R2_SECRET_ACCESS_KEY = 'a3e5a3f6c35c3bd812a4194af310eba7ff4ad7f5557eab1227d33b5fd5f6e9d4';
const R2_BUCKET_NAME = 'userdata';
// Public base URL to serve files
const R2_PUBLIC_BASE_URL = 'https://userdata.3f7449f6107cb515185cd38ca8b8059c.r2.cloudflarestorage.com';

// Create S3 client for R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_S3_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Upload binary file to R2 and return public URL
export const uploadToR2 = async (file, fileName) => {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    });
    await r2Client.send(command);
    return `${R2_PUBLIC_BASE_URL}/${fileName}`;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
};

// Upload image with specific optimizations
export const uploadImageToR2 = async (file, fileName, options = {}) => {
  try {
    const {
      folder = 'products',
      contentType = 'image/jpeg',
      cacheControl = 'public, max-age=31536000',
    } = options;

    const key = `${folder}/${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      CacheControl: cacheControl,
    });
    
    await r2Client.send(command);
    return `${R2_PUBLIC_BASE_URL}/${key}`;
  } catch (error) {
    console.error('Error uploading image to R2:', error);
    throw error;
  }
};

// Delete file from R2
export const deleteFromR2 = async (fileName, folder = 'products') => {
  try {
    const key = `${folder}/${fileName}`;
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    
    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting from R2:', error);
    throw error;
  }
};

// export const deleteFromR2 = async (fileName) => {
//   try {
//     const command = new DeleteObjectCommand({
//       Bucket: R2_BUCKET_NAME,
//       Key: fileName,
//     });
//     await r2Client.send(command);
//     return true;
//   } catch (error) {
//     console.error('Error deleting from R2:', error);
//     throw error;
//   }
// };

// JSON helpers
const streamToString = async (body) => {
  if (!body) return '';
  // In browsers, Body is a ReadableStream
  const res = new Response(body);
  return await res.text();
};

export const putJson = async (key, obj) => {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(obj),
    ContentType: 'application/json',
  });
  await r2Client.send(command);
  return `${R2_PUBLIC_BASE_URL}/${key}`;
};

export const getJson = async (key) => {
  const command = new GetObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key });
  const data = await r2Client.send(command);
  const text = await streamToString(data.Body);
  return text ? JSON.parse(text) : null;
};

export const listKeys = async (prefix) => {
  const command = new ListObjectsV2Command({ Bucket: R2_BUCKET_NAME, Prefix: prefix });
  const data = await r2Client.send(command);
  return (data.Contents || []).map((o) => o.Key).filter(Boolean);
};

// Profiles
export const fetchUserProfile = async (uid) => {
  try {
    return await getJson(`users/${uid}.json`);
  } catch (e) {
    return null;
  }
};

export const saveUserProfile = async (uid, profile) => {
  return await putJson(`users/${uid}.json`, profile);
};

// Products
const ensureId = (p) => p.id || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

export const saveProduct = async (product) => {
  const id = ensureId(product);
  const nowIso = new Date().toISOString();
  const record = { ...product, id, userType: product.userType, created_at: product.created_at || nowIso, updated_at: nowIso };
  await putJson(`products/${id}.json`, record);
  return record;
};

export const fetchProduct = async (id) => {
  return await getJson(`products/${id}.json`);
};

export const deleteProduct = async (id) => {
  await deleteFromR2(`products/${id}.json`);
  return true;
};

export const listProducts = async () => {
  try {
    const keys = await listKeys('products/');
    const jsonKeys = (keys || []).filter((k) => k.endsWith('.json'));
    const results = await Promise.all(
      jsonKeys.map(async (k) => {
        try { return await getJson(k); } catch { return null; }
      })
    );
    return results.filter(Boolean);
  } catch (error) {
    console.error('Error listing products:', error);
    return [];
  }
};

// Reviews
export const saveProductReview = async (productId, review) => {
  try {
    const id = ensureId(review);
    const nowIso = new Date().toISOString();
    const record = { id, rating: Number(review.rating), comment: review.comment || '', user_id: review.user_id, user_name: review.user_name || 'User', created_at: nowIso };
    await putJson(`products/${productId}/reviews/${id}.json`, record);
    return record;
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
};

export const listProductReviews = async (productId) => {
  try {
    const keys = await listKeys(`products/${productId}/reviews/`);
    const jsonKeys = (keys || []).filter((k) => k.endsWith('.json'));
    const results = await Promise.all(
      jsonKeys.map(async (k) => {
        try { return await getJson(k); } catch { return null; }
      })
    );
    return results.filter(Boolean);
  } catch (error) {
    console.error('Error listing reviews:', error);
    return [];
  }
};

// Presigned URL helpers (optional)
export const generatePresignedUploadUrl = async (fileName, contentType) => {
  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

export const generatePresignedDownloadUrl = async (fileName) => {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    });
    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

export default r2Client;
