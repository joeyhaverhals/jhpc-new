import { supabase } from '@/lib/supabase';

interface ImageDimensions {
  width: number;
  height: number;
}

interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export const getImageDimensions = (file: File): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const calculateAspectRatio = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio)
  };
};

export const optimizeImage = async (
  file: File,
  options: OptimizationOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'webp'
  } = options;

  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Get original dimensions
  const dimensions = await getImageDimensions(file);
  
  // Calculate new dimensions
  const newDimensions = calculateAspectRatio(
    dimensions.width,
    dimensions.height,
    maxWidth,
    maxHeight
  );

  // Set canvas dimensions
  canvas.width = newDimensions.width;
  canvas.height = newDimensions.height;

  // Create image element
  const img = new Image();
  img.src = URL.createObjectURL(file);

  // Return promise that resolves with optimized file
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Draw image to canvas with new dimensions
      ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not generate blob'));
            return;
          }

          // Create new file from blob
          const optimizedFile = new File(
            [blob],
            `${file.name.split('.')[0]}.${format}`,
            {
              type: `image/${format}`,
              lastModified: Date.now(),
            }
          );

          resolve(optimizedFile);
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = reject;
  });
};

export const uploadOptimizedImage = async (
  file: File,
  path: string,
  options?: OptimizationOptions
): Promise<string> => {
  try {
    // Optimize image before upload
    const optimizedFile = await optimizeImage(file, options);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('media')
      .upload(path, optimizedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading optimized image:', error);
    throw error;
  }
};
