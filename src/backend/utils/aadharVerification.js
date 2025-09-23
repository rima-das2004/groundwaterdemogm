/**
 * Aadhar Verification using Verhoeff Algorithm
 * Implementation of the Verhoeff checksum algorithm for 12-digit Aadhar validation
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

// Inverse table
const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates a 12-digit Aadhaar number using the Verhoeff algorithm
 * @param {string} aadharNumber - The 12-digit Aadhaar number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateAadhar(aadharNumber) {
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
 * Generates a random valid Aadhar number for testing purposes
 * @returns {string} - A valid 12-digit Aadhar number
 */
function generateValidAadhar() {
  // Generate first 11 digits randomly
  let baseNumber = '';
  for (let i = 0; i < 11; i++) {
    baseNumber += Math.floor(Math.random() * 10);
  }
  
  // Calculate the check digit
  const checkDigit = calculateCheckDigit(baseNumber);
  
  return baseNumber + checkDigit;
}

/**
 * Calculates the check digit for an 11-digit base Aadhar number
 * @param {string} baseNumber - The first 11 digits of Aadhar
 * @returns {number} - The check digit (0-9)
 */
function calculateCheckDigit(baseNumber) {
  if (!/^\d{11}$/.test(baseNumber)) {
    throw new Error('Base number must be exactly 11 digits');
  }
  
  // Try each possible check digit (0-9) to find the one that makes it valid
  for (let checkDigit = 0; checkDigit <= 9; checkDigit++) {
    const testNumber = baseNumber + checkDigit;
    if (validateAadhar(testNumber)) {
      return checkDigit;
    }
  }
  
  throw new Error('Unable to calculate valid check digit');
}

/**
 * Formats an Aadhar number with spaces for better readability
 * @param {string} aadharNumber - The 12-digit Aadhar number
 * @returns {string} - Formatted Aadhar number (XXXX XXXX XXXX)
 */
function formatAadhar(aadharNumber) {
  if (!aadharNumber || typeof aadharNumber !== 'string') {
    return '';
  }
  
  const cleanedNumber = aadharNumber.replace(/[\s-]/g, '');
  
  if (!/^\d{12}$/.test(cleanedNumber)) {
    return aadharNumber; // Return as-is if not 12 digits
  }
  
  return cleanedNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
}

/**
 * Masks an Aadhar number for display purposes (shows only last 4 digits)
 * @param {string} aadharNumber - The 12-digit Aadhar number
 * @returns {string} - Masked Aadhar number (XXXX XXXX 1234)
 */
function maskAadhar(aadharNumber) {
  if (!aadharNumber || typeof aadharNumber !== 'string') {
    return '';
  }
  
  const cleanedNumber = aadharNumber.replace(/[\s-]/g, '');
  
  if (!/^\d{12}$/.test(cleanedNumber)) {
    return 'XXXX XXXX XXXX'; // Return masked format if invalid
  }
  
  const lastFour = cleanedNumber.slice(-4);
  return `XXXX XXXX ${lastFour}`;
}

/**
 * Validates and sanitizes Aadhar input
 * @param {string} input - Raw Aadhar input
 * @returns {object} - Validation result with cleaned number and validity
 */
function validateAndSanitizeAadhar(input) {
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
    
    result.isValid = validateAadhar(cleanedNumber);
    
    if (result.isValid) {
      result.formattedNumber = formatAadhar(cleanedNumber);
      result.maskedNumber = maskAadhar(cleanedNumber);
    } else {
      result.error = 'Invalid Aadhar: Checksum verification failed';
    }
    
    return result;
    
  } catch (error) {
    result.error = `Validation error: ${error.message}`;
    return result;
  }
}

module.exports = {
  validateAadhar,
  generateValidAadhar,
  calculateCheckDigit,
  formatAadhar,
  maskAadhar,
  validateAndSanitizeAadhar
};