# ts-snappy-stream

Compress data over a Stream using the snappy framing format


## Installation

```
npm install @scottypoi/ts-snappy-stream
```


## Example

### Input

```typescript
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
```

### Output

```
Som data from the compressed stream <Buffer ff 06 00 00 73 4e 61 50 70 59>
Som data from the compressed stream <Buffer 01 09 00 00 bb 1f 82 a2 68 65 6c 6c 6f>
The data that was originally written
hello
Som data from the compressed stream <Buffer 01 09 00 00 2d 4e 1f a5 77 6f 72 6c 64>
The data that was originally written
world
```



## Licence

Copyright (c) 2025 ScottyPoi

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
