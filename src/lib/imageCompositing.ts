/**
 * Composite car image onto background
 */
export const compositeCarOnBackground = async (
  carPNG: string,
  backgroundColor: string,
  options?: {
    scale?: number;
    shadow?: boolean;
    position?: { x: number; y: number };
  }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d', { 
          alpha: true,
          willReadFrequently: false 
        });
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw background
        if (backgroundColor.startsWith('bg-gradient')) {
          // Extract gradient colors from Tailwind class
          // For now, use a solid color as fallback
          ctx.fillStyle = '#f5f5f5';
        } else if (backgroundColor === 'bg-white') {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#f5f5f5';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add shadow if requested
        if (options?.shadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetY = 10;
        }
        
        // Calculate position
        const scale = options?.scale || 1;
        const x = options?.position?.x || 0;
        const y = options?.position?.y || 0;
        
        // Draw car image
        ctx.drawImage(
          img,
          x,
          y,
          img.width * scale,
          img.height * scale
        );
        
        // Convert to data URL
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      
      img.onerror = reject;
      img.src = carPNG;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Create a preview composite with background
 */
export const createPreviewComposite = async (
  carPNG: string,
  backgroundClass: string
): Promise<string> => {
  return compositeCarOnBackground(carPNG, backgroundClass, {
    scale: 1,
    shadow: true
  });
};
