import JSZip from 'jszip';

export interface ColorAdjustments {
  saturation: number;
  brightness: number;
  contrast: number;
  warmth: number;
}

export interface BackgroundConfig {
  type: 'studio' | 'outdoor' | 'luxury' | 'premium' | 'gradient' | 'solid';
  color1?: string;
  color2?: string;
}

/**
 * Apply background replacement to an image
 */
export const applyBackgroundReplacement = async (
  imageDataUrl: string,
  background: BackgroundConfig
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw background
      if (background.type === 'gradient' && background.color1 && background.color2) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, background.color1);
        gradient.addColorStop(1, background.color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (background.type === 'studio') {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#f5f5f5');
        gradient.addColorStop(1, '#e0e0e0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (background.type === 'outdoor') {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98D8C8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (background.type === 'luxury') {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
        );
        gradient.addColorStop(0, '#2d2d2d');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (background.type === 'premium') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(0.5, '#7c3aed');
        gradient.addColorStop(1, '#db2777');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw original image on top with blend mode
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Apply color adjustments to an image
 */
export const applyColorAdjustments = async (
  imageDataUrl: string,
  adjustments: ColorAdjustments
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const { saturation, brightness, contrast, warmth } = adjustments;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Apply brightness
        r += brightness;
        g += brightness;
        b += brightness;

        // Apply contrast
        const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        r = contrastFactor * (r - 128) + 128;
        g = contrastFactor * (g - 128) + 128;
        b = contrastFactor * (b - 128) + 128;

        // Apply saturation
        const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
        r = gray + saturation * (r - gray);
        g = gray + saturation * (g - gray);
        b = gray + saturation * (b - gray);

        // Apply warmth
        r += warmth;
        b -= warmth;

        // Clamp values
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Add watermark to an image
 */
export const addWatermark = async (
  imageDataUrl: string,
  text: string,
  enabled: boolean
): Promise<string> => {
  if (!enabled) return imageDataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Add watermark
      const fontSize = Math.max(img.width / 40, 16);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(text, img.width - 20, img.height - 20);

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = imageDataUrl;
  });
};

/**
 * Download a single image
 */
export const downloadImage = (imageDataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = imageDataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download all images as a ZIP file
 */
export const downloadAllAsZip = async (
  images: Array<{ imageUrl: string; angle: string }>,
  sessionName: string
) => {
  const zip = new JSZip();
  const folder = zip.folder(sessionName);

  if (!folder) return;

  // Add each image to the zip
  for (let i = 0; i < images.length; i++) {
    const { imageUrl, angle } = images[i];
    // Convert data URL to blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const filename = `${i + 1}-${angle.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    folder.file(filename, blob);
  }

  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = `${sessionName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Process a single image with all enhancements
 */
export const processImage = async (
  imageDataUrl: string,
  background: BackgroundConfig,
  adjustments: ColorAdjustments,
  watermarkText: string,
  watermarkEnabled: boolean
): Promise<string> => {
  let processed = imageDataUrl;
  
  // Apply background
  processed = await applyBackgroundReplacement(processed, background);
  
  // Apply color adjustments
  processed = await applyColorAdjustments(processed, adjustments);
  
  // Add watermark
  processed = await addWatermark(processed, watermarkText, watermarkEnabled);
  
  return processed;
};
