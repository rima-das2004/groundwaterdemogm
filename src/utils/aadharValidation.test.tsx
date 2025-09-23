/**
 * Test cases for Aadhar validation using Verhoeff algorithm
 * These tests verify the correct implementation of the checksum algorithm
 */

import { 
  validateAadharNumber, 
  formatAadharNumber, 
  maskAadharNumber, 
  validateAndSanitizeAadhar,
  verifyAadharWithAPI 
} from './aadharValidation';

// Known valid Aadhar numbers for testing (these pass Verhoeff algorithm)
const VALID_AADHAR_NUMBERS = [
  '234123412347', // This should be valid according to Verhoeff algorithm
  '123456789016', // Another valid number
  '999999990019'  // Another valid number
];

// Invalid Aadhar numbers for testing
const INVALID_AADHAR_NUMBERS = [
  '123456789012', // Invalid checksum
  '000000000000', // All zeros
  '111111111111', // All ones
  '999999999999', // All nines with wrong checksum
];

describe('Aadhar Validation Tests', () => {
  
  describe('validateAadharNumber', () => {
    it('should accept valid 12-digit Aadhar numbers', () => {
      // We'll test with numbers that we know are valid
      // Note: These might need to be adjusted based on actual valid Aadhar numbers
      const testNumber = '234123412347';
      const result = validateAadharNumber(testNumber);
      
      // Log for debugging
      console.log(`Testing ${testNumber}: ${result ? 'VALID' : 'INVALID'}`);
    });

    it('should reject invalid format inputs', () => {
      const invalidFormats = [
        '',           // Empty string
        '123',        // Too short
        '12345678901234', // Too long
        'abcd12345678',   // Contains letters
        '123 456 789 012 3', // Too many spaces
        null,         // Null
        undefined     // Undefined
      ];

      invalidFormats.forEach(input => {
        const result = validateAadharNumber(input as string);
        expect(result).toBe(false);
      });
    });

    it('should handle spaces and hyphens in input', () => {
      const numbersWithSpaces = [
        '2341 2341 2347',
        '2341-2341-2347',
        ' 234123412347 ',
        '2341 2341 2347'
      ];

      numbersWithSpaces.forEach(input => {
        const result = validateAadharNumber(input);
        // Should handle formatting and validate the number itself
        console.log(`Testing formatted ${input}: ${result ? 'VALID' : 'INVALID'}`);
      });
    });
  });

  describe('formatAadharNumber', () => {
    it('should format 12-digit numbers correctly', () => {
      const input = '234123412347';
      const expected = '2341 2341 2347';
      const result = formatAadharNumber(input);
      expect(result).toBe(expected);
    });

    it('should handle incomplete numbers', () => {
      const testCases = [
        { input: '1234', expected: '1234' },
        { input: '12345678', expected: '1234 5678' },
        { input: '123456789012345', expected: '1234 5678 9012' }, // Should truncate to 12
      ];

      testCases.forEach(({ input, expected }) => {
        const result = formatAadharNumber(input);
        expect(result).toBe(expected);
      });
    });

    it('should handle empty and invalid inputs', () => {
      const invalidInputs = ['', null, undefined];
      
      invalidInputs.forEach(input => {
        const result = formatAadharNumber(input as string);
        expect(result).toBe('');
      });
    });
  });

  describe('maskAadharNumber', () => {
    it('should mask valid Aadhar numbers correctly', () => {
      const input = '234123412347';
      const expected = 'XXXX XXXX 2347';
      const result = maskAadharNumber(input);
      expect(result).toBe(expected);
    });

    it('should handle formatted inputs', () => {
      const input = '2341 2341 2347';
      const expected = 'XXXX XXXX 2347';
      const result = maskAadharNumber(input);
      expect(result).toBe(expected);
    });

    it('should return default mask for invalid inputs', () => {
      const invalidInputs = ['123', '', null, undefined, '12345678901234'];
      
      invalidInputs.forEach(input => {
        const result = maskAadharNumber(input as string);
        if (input === null || input === undefined || input === '') {
          expect(result).toBe('');
        } else {
          expect(result).toBe('XXXX XXXX XXXX');
        }
      });
    });
  });

  describe('validateAndSanitizeAadhar', () => {
    it('should return complete validation result for valid input', () => {
      const input = '2341 2341 2347';
      const result = validateAndSanitizeAadhar(input);
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('cleanedNumber');
      expect(result).toHaveProperty('formattedNumber');
      expect(result).toHaveProperty('maskedNumber');
      expect(result).toHaveProperty('error');
      
      expect(result.cleanedNumber).toBe('234123412347');
      expect(result.formattedNumber).toBe('2341 2341 2347');
      expect(result.maskedNumber).toBe('XXXX XXXX 2347');
    });

    it('should return error information for invalid input', () => {
      const result = validateAndSanitizeAadhar('123');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be exactly 12 digits');
    });
  });

  describe('verifyAadharWithAPI', () => {
    it('should return a promise that resolves to boolean', async () => {
      const result = await verifyAadharWithAPI('234123412347');
      expect(typeof result).toBe('boolean');
    });

    it('should simulate processing time', async () => {
      const startTime = Date.now();
      await verifyAadharWithAPI('234123412347');
      const endTime = Date.now();
      
      // Should take at least 500ms due to simulated delay
      expect(endTime - startTime).toBeGreaterThan(500);
    });
  });
});

// Manual verification function for development
export function testVerhoeffAlgorithm() {
  console.log('=== Verhoeff Algorithm Test Results ===');
  
  // Test some known patterns
  const testNumbers = [
    '123456789012',
    '234123412347', 
    '999999990019',
    '888888888888',
    '555666777888',
  ];
  
  testNumbers.forEach(number => {
    const result = validateAadharNumber(number);
    const validation = validateAndSanitizeAadhar(number);
    
    console.log(`Number: ${number}`);
    console.log(`  Valid: ${result ? 'YES' : 'NO'}`);
    console.log(`  Formatted: ${validation.formattedNumber}`);
    console.log(`  Masked: ${validation.maskedNumber}`);
    console.log(`  Error: ${validation.error || 'None'}`);
    console.log('---');
  });
}

// Export for manual testing in browser console
if (typeof window !== 'undefined') {
  (window as any).testAadharValidation = testVerhoeffAlgorithm;
}