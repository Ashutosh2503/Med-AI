/**
 * Lightweight client-side image compression utility.
 * Downscales images to max dimensions and compresses to JPEG to optimize memory,
 * prevent storage quota limits, and accelerate multimodal AI inference.
 */
export async function compressImage(
  dataUrlOrFile: string | File,
  maxWidth: number = 960,
  maxHeight: number = 960,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const processImage = () => {
      try {
        let { width, height } = img;

        // Maintain aspect ratio while scaling down
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original if 2D context fails
          resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : img.src);
          return;
        }

        // Draw with smoothing for high-fidelity edges
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('Image compression fallback:', err);
        resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : img.src);
      }
    };

    img.onload = processImage;
    img.onerror = (e) => reject(new Error('Failed to load image for compression: ' + e));

    if (typeof dataUrlOrFile === 'string') {
      img.src = dataUrlOrFile;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          img.src = e.target.result;
        } else {
          reject(new Error('Could not read image file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsDataURL(dataUrlOrFile);
    }
  });
}
