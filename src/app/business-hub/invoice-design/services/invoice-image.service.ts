
import { Injectable } from '@angular/core';

/**
 * Shared image loader used by invoice PDF templates.
 *
 * Supports:
 * - Base64 image data URLs
 * - Remote image URLs
 * - Image conversion to PNG data URLs
 *
 * Remote images must allow CORS requests from the application origin.
 */
export async function loadInvoiceImageAsDataUrl(
  source: string | null | undefined,
): Promise<string> {
  const value = String(source || '').trim();

  if (!value) {
    return '';
  }

  if (/^data:image\//i.test(value)) {
    return value;
  }

  try {
    const response = await fetch(value, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`Image request failed: ${response.status}`);
    }

    const blob = await response.blob();

    if (!blob.type.startsWith('image/')) {
      throw new Error('Invalid image format.');
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Image conversion failed.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Unable to read image.'));
      };

      reader.readAsDataURL(blob);
    });

    return await normalizeInvoiceImage(dataUrl);
  } catch (error) {
    console.error('Invoice image loading failed:', error);
    return '';
  }
}

/**
 * Normalizes an image data URL to PNG.
 * This also limits the image dimensions to keep PDF size reasonable.
 */
async function normalizeInvoiceImage(
  source: string,
): Promise<string> {
  return new Promise(resolve => {
    const image = new Image();

    image.onload = () => {
      try {
        const maxDimension = 1200;

        const naturalWidth = image.naturalWidth || image.width;
        const naturalHeight = image.naturalHeight || image.height;

        if (!naturalWidth || !naturalHeight) {
          resolve('');
          return;
        }

        const ratio = Math.min(
          1,
          maxDimension / Math.max(naturalWidth, naturalHeight),
        );

        const canvas = document.createElement('canvas');

        canvas.width = Math.max(
          1,
          Math.round(naturalWidth * ratio),
        );

        canvas.height = Math.max(
          1,
          Math.round(naturalHeight * ratio),
        );

        const context = canvas.getContext('2d');

        if (!context) {
          resolve(source);
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        console.warn(
          'Invoice image normalization failed:',
          error,
        );

        resolve(source);
      }
    };

    image.onerror = () => resolve('');

    image.src = source;
  });
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceImageService {
  loadLogoAsDataUrl(
    source: string | null | undefined,
  ): Promise<string> {
    return loadInvoiceImageAsDataUrl(source);
  }
}
