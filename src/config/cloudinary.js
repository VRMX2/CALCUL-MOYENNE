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
    formData.append('folder', CLOUDINARY_CONFIG.folder);

    // Add transformations for profile photos
    formData.append('transformation', JSON.stringify([
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
    ]));

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
                const response = JSON.parse(xhr.responseText);
                resolve(response.secure_url);
            } else {
                reject(new Error('Upload failed'));
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
        });

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
