import { describe, it, expect } from 'vitest';
import { checksum } from '../src/lib/checksum';
import { readFileSync } from 'fs';
import { join } from 'path';

function bufferToArray(buffer: Uint8Array): number[] {
  return Array.from(buffer);
}

// Read the expected test data
const expectedRows = JSON.parse(
  readFileSync(join(__dirname, 'checksum.expected'), 'utf-8')
);

describe('Checksum', () => {
  it('should match expected checksums for values 0-999', () => {
    expectedRows.forEach((expected: number[], index: number) => {
      const buffer = new Uint8Array(1);
      buffer[0] = index;
      const actual = bufferToArray(checksum(buffer));
      expect(actual).toEqual(expected);
    });
  });
}); 