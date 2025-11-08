/**
 * Composite car image onto background
 */
export const compositeCarOnBackground = async (
  carPNG: string,
  backgroundImageUrl: string,
  options?: {
    scale?: number;
    shadow?: boolean;
    position?: { x: number; y: number };
  }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const carImg = new Image();
      const bgImg = new Image();
      carImg.crossOrigin = 'anonymous';
      bgImg.crossOrigin = 'anonymous';
      
      let carLoaded = false;
      let bgLoaded = false;
      
      const tryComposite = () => {
        if (!carLoaded || !bgLoaded) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = bgImg.width;
        canvas.height = bgImg.height;
        
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
        
        // Draw background image
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        
        // Add shadow if requested
        if (options?.shadow) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetY = 10;
        }
        
        // Calculate scale to fit car in background while maintaining aspect ratio
        const scale = options?.scale || Math.min(
          canvas.width / carImg.width * 0.8,
          canvas.height / carImg.height * 0.8
        );
        
        const carWidth = carImg.width * scale;
        const carHeight = carImg.height * scale;
        
        // Center the car or use custom position
        const x = options?.position?.x ?? (canvas.width - carWidth) / 2;
        const y = options?.position?.y ?? (canvas.height - carHeight) / 2;
        
        // Draw car image
        ctx.drawImage(
          carImg,
          x,
          y,
          carWidth,
          carHeight
        );
        
        // Convert to data URL
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      
      carImg.onload = () => {
        carLoaded = true;
        tryComposite();
      };
      
      bgImg.onload = () => {
        bgLoaded = true;
        tryComposite();
      };
      
      carImg.onerror = () => reject(new Error('Failed to load car image'));
      bgImg.onerror = () => reject(new Error('Failed to load background image'));
      
      carImg.src = carPNG;
      bgImg.src = backgroundImageUrl;
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
  backgroundImageUrl: string
): Promise<string> => {
  return compositeCarOnBackground(carPNG, backgroundImageUrl, {
    scale: 1,
    shadow: true
  });
};
