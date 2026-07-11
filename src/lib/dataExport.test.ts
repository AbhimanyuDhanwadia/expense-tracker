import { describe, it, expect } from 'vitest';
import { escapeCsvValue, toCsv } from './dataExport';

describe('dataExport utilities', () => {
  describe('escapeCsvValue', () => {
    it('should return simple strings as-is', () => {
      expect(escapeCsvValue('Coffee')).toBe('Coffee');
      expect(escapeCsvValue(123)).toBe('123');
    });

    it('should quote strings containing commas', () => {
      expect(escapeCsvValue('Cafe, Mocha')).toBe('"Cafe, Mocha"');
    });

    it('should quote and escape strings containing quotes', () => {
      expect(escapeCsvValue('The "Best" Cafe')).toBe('"The ""Best"" Cafe"');
    });

    it('should quote strings containing newlines', () => {
      expect(escapeCsvValue('Line 1\nLine 2')).toBe('"Line 1\nLine 2"');
    });
  });

  describe('toCsv', () => {
    it('should return empty string for empty array', () => {
      expect(toCsv([])).toBe('');
    });

    it('should convert objects to valid CSV format', () => {
      const data = [
        { Type: 'Expense', Title: 'Coffee', Amount: 4.5 },
        { Type: 'Income', Title: 'Salary', Amount: 1000 },
      ];
      
      const expected = 
`Type,Title,Amount
Expense,Coffee,4.5
Income,Salary,1000`;

      expect(toCsv(data)).toBe(expected);
    });

    it('should handle complex characters in CSV cells', () => {
       const data = [
        { Type: 'Expense', Title: 'Groceries, "Food"', Amount: 120.5 },
      ];
      
      const expected = 
`Type,Title,Amount
Expense,"Groceries, ""Food""",120.5`;

      expect(toCsv(data)).toBe(expected);
    });
  });
});
