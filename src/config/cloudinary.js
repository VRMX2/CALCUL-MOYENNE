// Cloudinary configuration for profile photo uploads
export const CLOUDINARY_CONFIG = {
    cloudName: 'dmck7lqxj',
    uploadPreset: 'profile_photos', // Unsigned preset for secure browser uploads
    folder: 's1-calculator/profiles'
};

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} - Cloudinary image URL
 */
export const uploadToCloudinary = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && onProgress) {
                const percentComplete = Math.round((e.loaded / e.total) * 100);
                onProgress(percentComplete);
            }
        });

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.secure_url);
                } catch (error) {
                    console.error('Cloudinary response parse error:', error);
                    reject(new Error('Failed to parse upload response'));
                }
            } else {
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    const errorMsg = errorResponse.error?.message || 'Upload failed';
                    console.error('Cloudinary upload error:', errorResponse);
                    reject(new Error(`Upload failed: ${errorMsg}. Please ensure the upload preset 'profile_photos' exists in Cloudinary and is set to 'Unsigned'.`));
                } catch (e) {
                    console.error('Upload failed with status:', xhr.status, xhr.responseText);
                    reject(new Error(`Upload failed with status ${xhr.status}. Please check Cloudinary configuration.`));
                }
            }
        });

        xhr.addEventListener('error', () => {
            console.error('Network error during Cloudinary upload');
            reject(new Error('Network error during upload. Please check your internet connection.'));
        });

        xhr.addEventListener('timeout', () => {
            console.error('Cloudinary upload timeout');
            reject(new Error('Upload timeout. Please try again.'));
        });

        xhr.timeout = 60000; // 60 second timeout
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`);
        xhr.send(formData);
    });
};

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Only JPG, PNG, and WebP images are allowed' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'Image must be less than 5MB' };
    }

    return { valid: true, error: null };
};
