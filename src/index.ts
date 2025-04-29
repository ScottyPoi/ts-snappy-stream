import { CompressStream, CompressStreamOptions } from './lib/compress-stream';
import { UncompressStream, UncompressStreamOptions } from './lib/uncompress-stream';

export function createUncompressStream(opts?: UncompressStreamOptions): UncompressStream {
  return new UncompressStream(opts);
}

export function createCompressStream(opts?: CompressStreamOptions): CompressStream {
  return new CompressStream(opts);
}

export { CompressStream, UncompressStream };
export type { CompressStreamOptions, UncompressStreamOptions }; 