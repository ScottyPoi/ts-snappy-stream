import { createCompressStream, createUncompressStream } from '../src';
import { assert, describe, it } from 'vitest';
import { readFileSync } from 'fs';

const UNCOMPRESSED_CHUNK_SIZE = 65536;
const largerInput = readFileSync(__filename);
let superLargeInput = new Uint8Array(largerInput);
for (let i = largerInput.length; i <= UNCOMPRESSED_CHUNK_SIZE; i += largerInput.length) {
  superLargeInput = new Uint8Array([...superLargeInput, ...largerInput]);
}

const testCases = [
  {
    testName: "small",
    testString: "beep boop",
    asyncCompress: true
  },
  {
    testName: "small",
    testString: "beep boop",
    asyncCompress: false
  },
  {
    testName: "large",
    testString: largerInput,
    asyncCompress: true
  },
  {
    testName: "large",
    testString: largerInput,
    asyncCompress: false
  },
  {
    testName: "super large",
    testString: superLargeInput,
    asyncCompress: true
  },
  {
    testName: "super large",
    testString: superLargeInput,
    asyncCompress: false
  }
];

describe('compress', () => {
  testCases.forEach(({ testName, testString, asyncCompress }) => {
    it(`should compress ${testName} input - asyncCompress=${asyncCompress}`, async () => {
      const decompressed = await new Promise((resolve, reject) => {
        const compressStream = createCompressStream({ asyncCompress });
        const uncompressStream = createUncompressStream();
        const chunks: Uint8Array[] = [];

        uncompressStream.on('data', (chunk: Uint8Array) => {
          chunks.push(chunk);
        });

        uncompressStream.on('end', () => {
          const result = Buffer.concat(chunks);
          resolve(result);
        });

        uncompressStream.on('error', reject);
        compressStream.on('error', reject);

        compressStream.pipe(uncompressStream);
        compressStream.write(testString);
        compressStream.end();
      });

      const expected = typeof testString === 'string' 
        ? Buffer.from(testString)
        : Buffer.from(testString);
      assert.deepEqual(decompressed, expected);
    });
  });
}); 