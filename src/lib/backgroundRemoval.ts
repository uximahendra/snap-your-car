import { pipeline, env } from '@huggingface/transformers';

// Configure Transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

let segmentationPipeline: any = null;

/**
 * Initialize the segmentation pipeline
 */
export const initializeBackgroundRemoval = async (onProgress?: (progress: number) => void) => {
  if (segmentationPipeline) return segmentationPipeline;

  try {
    segmentationPipeline = await pipeline(
      'image-segmentation',
      'Xenova/segformer-b0-finetuned-ade-512-512',
      {
        progress_callback: onProgress ? (progress: any) => {
          if (progress.status === 'progress') {
            onProgress(progress.progress || 0);
          }
        } : undefined
      }
    );
    return segmentationPipeline;
  } catch (error) {
    console.error('Error initializing background removal:', error);
    throw error;
  }
};

/**
 * Load image from data URL or blob
 */
export const loadImage = (src: string | Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    
    if (typeof src === 'string') {
      img.src = src;
    } else {
      img.src = URL.createObjectURL(src);
    }
  });
};

/**
 * Convert data URL to Blob
 */
export const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Convert Blob to data URL
 */
export const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Remove background from image
 */
export const removeBackground = async (
  imageElement: HTMLImageElement,
  onProgress?: (step: string) => void
): Promise<string> => {
  try {
    onProgress?.('Loading AI model...');
    
    // Initialize pipeline if not already done
    const pipeline = await initializeBackgroundRemoval();
    
    onProgress?.('Detecting objects...');
    
    // Create canvas for the image
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Draw original image
    ctx.drawImage(imageElement, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    onProgress?.('Creating mask...');
    
    // Perform segmentation
    const result = await pipeline(imageElement);
    
    onProgress?.('Removing background...');
    
    // Find the car/vehicle mask (usually labeled as 'car', 'vehicle', or similar)
    const carMask = result.find((r: any) => 
      r.label.toLowerCase().includes('car') || 
      r.label.toLowerCase().includes('vehicle') ||
      r.label.toLowerCase().includes('auto')
    );
    
    if (carMask && carMask.mask) {
      // Apply the mask to make background transparent
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext('2d');
      
      if (maskCtx) {
        maskCtx.drawImage(carMask.mask, 0, 0, canvas.width, canvas.height);
        const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Apply mask to original image (make non-car pixels transparent)
        for (let i = 0; i < imageData.data.length; i += 4) {
          const maskValue = maskData.data[i]; // Red channel of mask
          imageData.data[i + 3] = maskValue; // Set alpha based on mask
        }
        
        ctx.putImageData(imageData, 0, 0);
      }
    }
    
    onProgress?.('Finalizing...');
    
    // Convert to PNG data URL
    return canvas.toDataURL('image/png', 1.0);
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

/**
 * Process a single image (convenience function)
 */
export const processImage = async (
  imageDataUrl: string,
  onProgress?: (step: string) => void
): Promise<string> => {
  const img = await loadImage(imageDataUrl);
  return removeBackground(img, onProgress);
};
