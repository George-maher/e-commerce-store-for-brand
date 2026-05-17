// Cloudinary configuration and utility functions

// Cloudinary configuration - you can update these values as needed
const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dp81ule09",
  UPLOAD_PRESET: "react2",
  BASE_URL: "https://api.cloudinary.com/v1_1"
};

/**
 * Upload an image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<Object>} - Promise that resolves with the Cloudinary response
 */
export const uploadToCloudinary = (file, onProgress) => {
  console.log('🔄 Starting Cloudinary upload for file:', file.name);
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `${CLOUDINARY_CONFIG.BASE_URL}/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`
    );

    // Add progress tracking if callback provided
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
          console.log(`📊 Upload progress: ${percent}%`);
        }
      });
    }

    xhr.onload = () => {
      console.log('📥 Cloudinary response status:', xhr.status);
      console.log('📥 Cloudinary response:', xhr.responseText);
      
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.secure_url) {
            console.log('✅ Upload successful:', data.secure_url);
            resolve(data);
          } else {
            console.error('❌ No secure_url in response:', data);
            reject(new Error('No secure URL returned from Cloudinary'));
          }
        } catch (parseError) {
          console.error('❌ Failed to parse Cloudinary response:', parseError);
          reject(new Error('Invalid response from Cloudinary'));
        }
      } else {
        console.error('❌ Cloudinary upload failed with status:', xhr.status);
        console.error('❌ Response:', xhr.responseText);
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = (error) => {
      console.error('❌ Network error during upload:', error);
      reject(new Error("Network error during upload"));
    };
    
    xhr.send(formData);
  });
};

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with isValid and error properties
 */
export const validateImageFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  } = options;

  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `${file.name} is not a valid image file. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }

  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `${file.name} exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit` 
    };
  }

  return { isValid: true };
};

/**
 * Create a preview URL for an image file
 * @param {File} file - The image file
 * @returns {Promise<string>} - Promise that resolves with the preview URL
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

export default CLOUDINARY_CONFIG;
