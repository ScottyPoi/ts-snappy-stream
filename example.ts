import { createCompressStream, createUncompressStream } from './src/index.ts';

// Create streams with proper type annotations
const compressStream = createCompressStream();
const uncompressStream = createUncompressStream({
  asBuffer: false // Optional: emit strings instead of buffers
});

// Set up event handlers with proper types
compressStream.on('data', (chunk: Uint8Array) => {
  console.log('Some data from the compressed stream:', chunk);
  uncompressStream.write(chunk);
});

uncompressStream.on('data', (chunk: string) => {
  console.log('The data that was originally written:');
  console.log(chunk);
});

// Write some data
compressStream.write('hello');
compressStream.write('world');
compressStream.end(); 