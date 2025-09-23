/**
 * Verhoeff Algorithm Implementation for 12-digit Aadhar Validation
 * 
 * How to validate a 12-digit Aadhaar (step by step):
 * 1. Precheck: Confirm the input is exactly 12 numeric digits. If not, reject.
 * 2. Reverse the digits (process from rightmost → leftmost).
 * 3. Set c = 0 (an integer accumulator).
 * 4. For each digit in the reversed array, at position i = 0,1,2,...:
 *    - Convert the digit character to a number d_i.
 *    - Look up p[i mod 8][d_i].
 *    - Update c = d[c][ p[i mod 8][d_i] ].
 * 5. After processing all digits, the number is valid iff c === 0.
 */

// Multiplication table
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// Permutation table
const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

/**
 * Validates a 12-digit Aadhaar number using the Verhoeff algorithm
 * @param aadharNumber - The Aadhar number to validate
 * @returns boolean - True if valid, false otherwise
 */
export function validateAadharNumber(aadharNumber: string): boolean {
  try {
    // Step 1: Precheck - Confirm the input is exactly 12 numeric digits
    if (!aadharNumber || typeof aadharNumber !== 'string') {
      return false;
    }

    // Remove any spaces or hyphens
    const cleanedNumber = aadharNumber.replace(/[\s-]/g, '');
    
    // Check if exactly 12 digits
    if (!/^\d{12}$/.test(cleanedNumber)) {
      return false;
    }

    // Step 2: Reverse the digits (process from rightmost → leftmost)
    const digits = cleanedNumber.split('').reverse();
    
    // Step 3: Set c = 0 (an integer accumulator)
    let c = 0;
    
    // Step 4: For each digit in the reversed array, at position i = 0,1,2,...
    for (let i = 0; i < digits.length; i++) {
      // Convert the digit character to a number d_i
      const digit = parseInt(digits[i], 10);
      
      // Look up p[i mod 8][d_i]
      const pValue = p[i % 8][digit];
      
      // Update c = d[c][p[i mod 8][d_i]]
      c = d[c][pValue];
    }
    
    // Step 5: After processing all digits, the number is valid iff c === 0
    return c === 0;
    
  } catch (error) {
    console.error('Error validating Aadhar:', error);
    return false;
  }
}

/**
 * Formats an Aadhar number with spaces for better readability
 * @param aadharNumber - The 12-digit Aadhar number
 * @returns string - Formatted Aadhar number (XXXX XXXX XXXX)
 */
export function formatAadharNumber(aadharNumber: string): string {
  if (!aadharNumber || typeof aadharNumber !== 'string') {
    return '';
  }
  
  const cleanNumber = aadharNumber.replace(/\D/g, '');
  
  // Limit to 12 digits
  const limitedNumber = cleanNumber.slice(0, 12);
  
  // Format as XXXX XXXX XXXX
  return limitedNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3').trim();
}

/**
 * Checks if Aadhar number has valid format (12 digits)
 * @param aadharNumber - The Aadhar number to check
 * @returns boolean - True if format is valid
 */
export function isValidAadharFormat(aadharNumber: string): boolean {
  if (!aadharNumber || typeof aadharNumber !== 'string') {
    return false;
  }
  
  const cleanNumber = aadharNumber.replace(/[\s-]/g, '');
  return /^\d{12}$/.test(cleanNumber);
}

/**
 * Masks an Aadhar number for display purposes (shows only last 4 digits)
 * @param aadharNumber - The 12-digit Aadhar number
 * @returns string - Masked Aadhar number (XXXX XXXX 1234)
 */
export function maskAadharNumber(aadharNumber: string): string {
  if (!aadharNumber || typeof aadharNumber !== 'string') {
    return '';
  }
  
  const cleanNumber = aadharNumber.replace(/[\s-]/g, '');
  
  if (!/^\d{12}$/.test(cleanNumber)) {
    return 'XXXX XXXX XXXX'; // Return masked format if invalid
  }
  
  const lastFour = cleanNumber.slice(-4);
  return `XXXX XXXX ${lastFour}`;
}

/**
 * Validates and sanitizes Aadhar input
 * @param input - Raw Aadhar input
 * @returns object - Validation result with cleaned number and validity
 */
export function validateAndSanitizeAadhar(input: string): {
  isValid: boolean;
  cleanedNumber: string;
  formattedNumber: string;
  maskedNumber: string;
  error: string;
} {
  const result = {
    isValid: false,
    cleanedNumber: '',
    formattedNumber: '',
    maskedNumber: '',
    error: ''
  };
  
  try {
    if (!input || typeof input !== 'string') {
      result.error = 'Invalid input: Aadhar number is required';
      return result;
    }
    
    const cleanedNumber = input.replace(/[\s-]/g, '');
    result.cleanedNumber = cleanedNumber;
    
    if (!/^\d{12}$/.test(cleanedNumber)) {
      result.error = 'Invalid format: Aadhar number must be exactly 12 digits';
      return result;
    }
    
    result.isValid = validateAadharNumber(cleanedNumber);
    
    if (result.isValid) {
      result.formattedNumber = formatAadharNumber(cleanedNumber);
      result.maskedNumber = maskAadharNumber(cleanedNumber);
    } else {
      result.error = 'Invalid Aadhar: Checksum verification failed';
    }
    
    return result;
    
  } catch (error) {
    result.error = `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return result;
  }
}

/**
 * Function to verify Aadhar using Verhoeff algorithm (replaces API call)
 * @param aadhaar - The Aadhar number to verify
 * @returns Promise<boolean> - True if valid
 */
export async function verifyAadharWithAPI(aadhaar: string): Promise<boolean> {
  try {
    // Use Verhoeff algorithm for validation instead of external API
    console.log('Using Verhoeff algorithm for Aadhar verification');
    
    // Simulate some processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use our Verhoeff algorithm implementation
    const validation = validateAndSanitizeAadhar(aadhaar);
    
    if (!validation.isValid && validation.error) {
      console.log('Aadhar validation failed:', validation.error);
    }
    
    return validation.isValid;
    
  } catch (error) {
    console.error('Aadhar verification error:', error);
    return false;
  }
}