// ====================================
// TeddyBear's Room - Encryption Utility
// Client-side AES-GCM encryption for sensitive measurements
// ====================================

// Type definitions
export interface SensitiveMeasurements {
  handSize?: number;        // mm
  preferredIntensity?: 'light' | 'medium' | 'strong';
  customNotes?: string;
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
}

// Constants
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for GCM

/**
 * Derive a cryptographic key from user-specific data
 * Uses PBKDF2 with user ID + app secret for key derivation
 */
async function deriveKey(userId: string, salt: string): Promise<CryptoKey> {
  // Use Web Crypto API (available in both browser and Node.js)
  const encoder = new TextEncoder();

  // Import the password material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(userId + salt),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive the actual encryption key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt sensitive measurement data
 * @param data - The measurements to encrypt
 * @param userId - User's unique ID (used for key derivation)
 * @returns Encrypted data with IV (base64 encoded)
 */
export async function encryptMeasurements(
  data: SensitiveMeasurements,
  userId: string
): Promise<string> {
  // Get the salt from environment or use a default for development
  const salt = process.env.NEXT_PUBLIC_ENCRYPTION_SALT || 'tbr-dev-salt-2025';

  // Derive the encryption key
  const key = await deriveKey(userId, salt);

  // Generate a random IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  // Encode the data
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));

  // Encrypt
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encodedData
  );

  // Combine IV + ciphertext and encode as base64
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt sensitive measurement data
 * @param encryptedString - Base64 encoded encrypted data (IV + ciphertext)
 * @param userId - User's unique ID (used for key derivation)
 * @returns Decrypted measurements
 */
export async function decryptMeasurements(
  encryptedString: string,
  userId: string
): Promise<SensitiveMeasurements | null> {
  try {
    // Get the salt from environment
    const salt = process.env.NEXT_PUBLIC_ENCRYPTION_SALT || 'tbr-dev-salt-2025';

    // Derive the encryption key
    const key = await deriveKey(userId, salt);

    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedString)
        .split('')
        .map(c => c.charCodeAt(0))
    );

    // Extract IV and ciphertext
    const iv = combined.slice(0, IV_LENGTH);
    const ciphertext = combined.slice(IV_LENGTH);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      ciphertext
    );

    // Decode and parse
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decrypted);

    return JSON.parse(jsonString) as SensitiveMeasurements;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

/**
 * Check if encryption is available in current environment
 */
export function isEncryptionAvailable(): boolean {
  return typeof crypto !== 'undefined' &&
         typeof crypto.subtle !== 'undefined';
}

/**
 * Size mapping utilities
 */
export const SIZE_MAPPINGS = {
  top: {
    korean: ['85', '90', '95', '100', '105', '110'],
    international: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  bottom: {
    inches: ['26', '28', '30', '32', '34', '36', '38'],
    international: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  shoes: {
    mm: ['230', '240', '250', '260', '270', '280', '290'],
    us: ['5', '6', '7', '8', '9', '10', '11', '12'],
    eu: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  },
};

/**
 * Validate size input
 */
export function validateSizeInput(
  field: 'height' | 'weight' | 'topSize' | 'bottomSize' | 'shoeSize',
  value: string | number
): boolean {
  switch (field) {
    case 'height':
      const height = Number(value);
      return height >= 100 && height <= 250; // cm
    case 'weight':
      const weight = Number(value);
      return weight >= 30 && weight <= 200; // kg
    case 'topSize':
      return SIZE_MAPPINGS.top.korean.includes(String(value)) ||
             SIZE_MAPPINGS.top.international.includes(String(value).toUpperCase());
    case 'bottomSize':
      return SIZE_MAPPINGS.bottom.inches.includes(String(value)) ||
             SIZE_MAPPINGS.bottom.international.includes(String(value).toUpperCase());
    case 'shoeSize':
      return SIZE_MAPPINGS.shoes.mm.includes(String(value)) ||
             SIZE_MAPPINGS.shoes.us.includes(String(value)) ||
             SIZE_MAPPINGS.shoes.eu.includes(String(value));
    default:
      return false;
  }
}
