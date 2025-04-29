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
    testName: "small string",
    input: "beep boop",
    asBuffer: false
  },
  {
    testName: "small buffer",
    input: new TextEncoder().encode("beep boop"),
    asBuffer: true
  },
  {
    testName: "large string",
    input: new TextDecoder().decode(largerInput),
    asBuffer: false
  },
  {
    testName: "large buffer",
    input: largerInput,
    asBuffer: true
  },
  {
    testName: "super large string",
    input: new TextDecoder().decode(superLargeInput),
    asBuffer: false
  },
  {
    testName: "super large buffer",
    input: superLargeInput,
    asBuffer: true
  }
];

describe('uncompress', () => {
  testCases.forEach(({ testName, input, asBuffer }) => {
    it(`should uncompress ${testName}`, async () => {
      const decompressed = await new Promise((resolve, reject) => {
        const compressStream = createCompressStream();
        const uncompressStream = createUncompressStream({ asBuffer });
        const chunks: (string | Uint8Array)[] = [];

        uncompressStream.on('data', (chunk: string | Uint8Array) => {
          chunks.push(chunk);
        });

        uncompressStream.on('end', () => {
          const result = asBuffer 
            ? Buffer.concat(chunks as Uint8Array[])
            : (chunks as string[]).join('');
          resolve(result);
        });

        uncompressStream.on('error', reject);
        compressStream.on('error', reject);

        compressStream.pipe(uncompressStream);
        compressStream.write(input);
        compressStream.end();
      });

      const expected = typeof input === 'string' 
        ? input 
        : Buffer.from(input);
      assert.deepEqual(decompressed, expected);
    });
  });

  it('should handle bad identifier', async () => {
    return new Promise((resolve, reject) => {
      const uncompressStream = createUncompressStream();

      uncompressStream.on('error', (err: Error) => {
        assert.equal(err.message, 'malformed input: bad identifier');
        resolve(undefined);
      });

      uncompressStream.write(new Uint8Array([0xff, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
      uncompressStream.end();
    });
  });
}); 